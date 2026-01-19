package expo.modules.customspeech

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.os.Handler
import android.os.Looper
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.util.Locale

class ExpoCustomSpeechModule : Module() {
  private var speechRecognizer: SpeechRecognizer? = null
  private var isPaused = false
  private var textToSpeech: TextToSpeech? = null
  private var ttsInitialized = false
  
  // Handler to run on main thread
  private val mainHandler = Handler(Looper.getMainLooper())

  override fun definition() = ModuleDefinition {
    Name("ExpoCustomSpeech")

    Events("onSpeechResult", "onSpeechError", "onSpeechStart", "onSpeechEnd", "onAudioLevel", "onTTSStart", "onTTSComplete", "onTTSError")

    // Check Permissions
    AsyncFunction("requestPermissions") { promise: Promise ->
      val context = appContext.reactContext ?: run {
        promise.resolve("denied")
        return@AsyncFunction
      }

      val hasRecordPermission = ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.RECORD_AUDIO
      ) == PackageManager.PERMISSION_GRANTED

      if (hasRecordPermission && SpeechRecognizer.isRecognitionAvailable(context)) {
        promise.resolve("granted")
      } else {
        promise.resolve("denied")
      }
    }

    // Start Listening
    AsyncFunction("start") { language: String?, promise: Promise ->
      mainHandler.post {
        try {
          val context = appContext.reactContext ?: run {
            promise.reject("CONTEXT_ERROR", "React context not available", null)
            return@post
          }

          // Check if recognition is available
          if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            promise.reject("SPEECH_NOT_AVAILABLE", "Speech recognition not available", null)
            return@post
          }

          // Check permission
          val hasRecordPermission = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.RECORD_AUDIO
          ) == PackageManager.PERMISSION_GRANTED

          if (!hasRecordPermission) {
            promise.reject("PERMISSION_DENIED", "Microphone permission not granted", null)
            return@post
          }

          // Stop existing recognition
          speechRecognizer?.destroy()
          isPaused = false
          
          speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
          
          val selectedLanguage = language ?: "en-US"
          val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, selectedLanguage)
          }

          speechRecognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {}
            override fun onBeginningOfSpeech() {
              sendEvent("onSpeechStart", mapOf("timestamp" to System.currentTimeMillis()))
            }
            override fun onRmsChanged(rmsdB: Float) {
              if (!isPaused) {
                sendEvent("onAudioLevel", mapOf("level" to rmsdB))
              }
            }
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {
              sendEvent("onSpeechEnd", mapOf("timestamp" to System.currentTimeMillis()))
            }
            
            override fun onError(error: Int) {
              val errorMessage = when (error) {
                SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
                SpeechRecognizer.ERROR_NETWORK -> "Network error"
                SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                SpeechRecognizer.ERROR_NO_MATCH -> "No match found"
                SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "RecognitionService busy"
                SpeechRecognizer.ERROR_SERVER -> "Server error"
                SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech input"
                else -> "Unknown error: $error"
              }
              sendEvent("onSpeechError", mapOf("error" to errorMessage))
            }

            override fun onResults(results: Bundle?) {
              val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
              if (!matches.isNullOrEmpty()) {
                sendEvent("onSpeechResult", mapOf("text" to matches[0], "isFinal" to true))
              }
            }

            override fun onPartialResults(partialResults: Bundle?) {
              val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
              if (!matches.isNullOrEmpty()) {
                sendEvent("onSpeechResult", mapOf("text" to matches[0], "isFinal" to false))
              }
            }

            override fun onEvent(eventType: Int, params: Bundle?) {}
          })

          speechRecognizer?.startListening(intent)
          promise.resolve()
          
        } catch (exception: Exception) {
          promise.reject("START_ERROR", exception.message, exception)
        }
      }
    }

    // Stop Listening
    AsyncFunction("stop") { promise: Promise ->
      mainHandler.post {
        try {
          speechRecognizer?.stopListening()
          speechRecognizer?.destroy()
          speechRecognizer = null
          isPaused = false
          promise.resolve()
        } catch (exception: Exception) {
          promise.reject("STOP_ERROR", exception.message, exception)
        }
      }
    }

    // Pause Listening
    AsyncFunction("pause") { promise: Promise ->
      mainHandler.post {
        try {
          if (speechRecognizer != null && !isPaused) {
            isPaused = true
            promise.resolve()
          } else {
            promise.reject("PAUSE_ERROR", "Speech recognizer not active or already paused", null)
          }
        } catch (exception: Exception) {
          promise.reject("PAUSE_ERROR", exception.message, exception)
        }
      }
    }

    // Resume Listening
    AsyncFunction("resume") { promise: Promise ->
      mainHandler.post {
        try {
          if (speechRecognizer != null && isPaused) {
            isPaused = false
            promise.resolve()
          } else {
            promise.reject("RESUME_ERROR", "Speech recognizer not paused", null)
          }
        } catch (exception: Exception) {
          promise.reject("RESUME_ERROR", exception.message, exception)
        }
      }
    }

    // Text-to-Speech Methods
    AsyncFunction("speak") { text: String, language: String?, promise: Promise ->
      mainHandler.post {
        try {
          val context = appContext.reactContext ?: run {
            promise.reject("TTS_ERROR", "React context not available", null)
            return@post
          }

          // Initialize TTS if not already done
          if (textToSpeech == null) {
            textToSpeech = TextToSpeech(context) { status ->
              if (status == TextToSpeech.SUCCESS) {
                ttsInitialized = true
                setupTTSListener()
                performSpeak(text, language, promise)
              } else {
                promise.reject("TTS_INIT_ERROR", "Failed to initialize TextToSpeech", null)
              }
            }
          } else if (ttsInitialized) {
            performSpeak(text, language, promise)
          } else {
            promise.reject("TTS_ERROR", "TextToSpeech not initialized", null)
          }
        } catch (exception: Exception) {
          promise.reject("TTS_ERROR", exception.message, exception)
        }
      }
    }

    AsyncFunction("stopSpeaking") { promise: Promise ->
      mainHandler.post {
        try {
          textToSpeech?.stop()
          promise.resolve()
        } catch (exception: Exception) {
          promise.reject("TTS_STOP_ERROR", exception.message, exception)
        }
      }
    }

    AsyncFunction("isSpeaking") { promise: Promise ->
      mainHandler.post {
        try {
          val speaking = textToSpeech?.isSpeaking ?: false
          promise.resolve(speaking)
        } catch (exception: Exception) {
          promise.reject("TTS_ERROR", exception.message, exception)
        }
      }
    }

    OnDestroy {
      speechRecognizer?.destroy()
      speechRecognizer = null
      textToSpeech?.stop()
      textToSpeech?.shutdown()
      textToSpeech = null
    }
  }

  private fun setupTTSListener() {
    textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
      override fun onStart(utteranceId: String?) {
        sendEvent("onTTSStart", mapOf("timestamp" to System.currentTimeMillis()))
      }

      override fun onDone(utteranceId: String?) {
        sendEvent("onTTSComplete", mapOf("timestamp" to System.currentTimeMillis()))
      }

      override fun onError(utteranceId: String?) {
        sendEvent("onTTSError", mapOf("error" to "TTS playback error"))
      }
    })
  }

  private fun performSpeak(text: String, language: String?, promise: Promise) {
    try {
      val selectedLanguage = language ?: "en-US"
      val locale = Locale.forLanguageTag(selectedLanguage)
      
      val result = textToSpeech?.setLanguage(locale)
      if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
        promise.reject("TTS_LANGUAGE_ERROR", "Language not supported: $selectedLanguage", null)
        return
      }

      val params = Bundle()
      params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "ExpoCustomSpeechTTS")
      
      textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, params, "ExpoCustomSpeechTTS")
      promise.resolve()
    } catch (exception: Exception) {
      promise.reject("TTS_SPEAK_ERROR", exception.message, exception)
    }
  }
}