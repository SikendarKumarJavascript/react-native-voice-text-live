import ExpoModulesCore
import Speech
import AVFoundation

// Separate delegate class for AVSpeechSynthesizer
private class SpeechSynthesizerDelegate: NSObject, AVSpeechSynthesizerDelegate {
  weak var module: ExpoCustomSpeechModule?
  
  func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
    module?.sendEvent("onTTSComplete", ["timestamp": Date().timeIntervalSince1970 * 1000])
  }
  
  func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
    module?.sendEvent("onTTSComplete", ["timestamp": Date().timeIntervalSince1970 * 1000])
  }
}

public class ExpoCustomSpeechModule: Module {
  // Speech Recognizer Variables
  private var speechRecognizer: SFSpeechRecognizer?
  private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
  private var recognitionTask: SFSpeechRecognitionTask?
  private let audioEngine = AVAudioEngine()
  
  // Text-to-Speech Variables
  private let speechSynthesizer = AVSpeechSynthesizer()
  private let speechDelegate = SpeechSynthesizerDelegate()

  public func definition() -> ModuleDefinition {
    Name("ExpoCustomSpeech")

    // Events to send to JavaScript
    Events("onSpeechResult", "onSpeechError", "onTTSStart", "onTTSComplete", "onTTSError")
    
    // Set up delegate reference
    OnCreate {
      self.speechDelegate.module = self
      self.speechSynthesizer.delegate = self.speechDelegate
    }

    // 1. Request Permissions
    AsyncFunction("requestPermissions") { (promise: Promise) in
      // Check if speech recognizer is available (use default locale for check)
      let tempRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
      guard let tempRecognizer = tempRecognizer, tempRecognizer.isAvailable else {
        promise.resolve("denied")
        return
      }
      
      SFSpeechRecognizer.requestAuthorization { authStatus in
        DispatchQueue.main.async {
          switch authStatus {
          case .authorized:
            // Also check microphone permission
            AVAudioSession.sharedInstance().requestRecordPermission { micGranted in
              DispatchQueue.main.async {
                promise.resolve(micGranted ? "granted" : "denied")
              }
            }
          case .denied, .restricted, .notDetermined:
            promise.resolve("denied")
          @unknown default:
            promise.resolve("denied")
          }
        }
      }
    }

    // 2. Start Listening
    AsyncFunction("start") { (language: String?, promise: Promise) in
      do {
        try self.startRecording(language: language ?? "en-US")
        promise.resolve()
      } catch {
        self.sendEvent("onSpeechError", ["error": error.localizedDescription])
        promise.reject("START_ERROR", error.localizedDescription)
      }
    }

    // 3. Stop Listening
    AsyncFunction("stop") { (promise: Promise) in
      self.stopRecording()
      promise.resolve()
    }
    
    // 4. Text-to-Speech: Speak
    AsyncFunction("speak") { (text: String, language: String?, promise: Promise) in
      let selectedLanguage = language ?? "en-US"
      
      let utterance = AVSpeechUtterance(string: text)
      utterance.voice = AVSpeechSynthesisVoice(language: selectedLanguage)
      utterance.rate = AVSpeechUtteranceDefaultSpeechRate
      
      self.speechSynthesizer.speak(utterance)
      self.sendEvent("onTTSStart", ["timestamp": Date().timeIntervalSince1970 * 1000])
      promise.resolve()
    }
    
    // 5. Stop Speaking
    AsyncFunction("stopSpeaking") { (promise: Promise) in
      self.speechSynthesizer.stopSpeaking(at: .immediate)
      promise.resolve()
    }
    
    // 6. Is Speaking
    AsyncFunction("isSpeaking") { (promise: Promise) in
      promise.resolve(self.speechSynthesizer.isSpeaking)
    }
  }

  private func startRecording(language: String) throws {
    // Stop any existing recognition
    if audioEngine.isRunning {
      audioEngine.stop()
      recognitionRequest?.endAudio()
    }

    // Create speech recognizer for the specified language
    speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: language))

    // Check permissions
    guard let speechRecognizer = speechRecognizer, speechRecognizer.isAvailable else {
      throw NSError(domain: "SpeechRecognizer", code: 1, userInfo: [NSLocalizedDescriptionKey: "Speech recognizer not available for language: \(language)"])
    }

    // Configure audio session
    let audioSession = AVAudioSession.sharedInstance()
    try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
    try audioSession.setActive(true, options: .notifyOthersOnDeactivation)

    // Create recognition request
    recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
    let inputNode = audioEngine.inputNode
    
    guard let recognitionRequest = recognitionRequest else {
      throw NSError(domain: "SpeechRecognizer", code: 2, userInfo: [NSLocalizedDescriptionKey: "Unable to create recognition request"])
    }
    
    recognitionRequest.shouldReportPartialResults = true

    // Create recognition task
    recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) { [weak self] result, error in
      var isFinal = false
      
      if let result = result {
        // Send transcribed text to JavaScript
        self?.sendEvent("onSpeechResult", [
          "text": result.bestTranscription.formattedString
        ])
        isFinal = result.isFinal
      }
      
      if let error = error {
        self?.sendEvent("onSpeechError", ["error": error.localizedDescription])
        self?.stopRecording()
        return
      }
      
      if isFinal {
        self?.stopRecording()
      }
    }

    // Configure audio input
    let recordingFormat = inputNode.outputFormat(forBus: 0)
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { [weak self] (buffer, when) in
      self?.recognitionRequest?.append(buffer)
    }

    // Start audio engine
    audioEngine.prepare()
    try audioEngine.start()
  }

  private func stopRecording() {
    audioEngine.stop()
    audioEngine.inputNode.removeTap(onBus: 0)
    recognitionRequest?.endAudio()
    recognitionRequest = nil
    recognitionTask = nil
  }
}