# react-native-voice-text-live

Complete speech recognition and text-to-speech solution for React Native and Expo apps with real-time transcription and multi-language support.

## 🚀 Features

### Speech Recognition (Speech-to-Text)

- ✅ **Real-time transcription** with partial results
- ✅ **Multi-language support** (15+ languages)
- ✅ **Audio level monitoring** (RMS dB values)
- ✅ **Start/Stop/Pause/Resume** controls
- ✅ **Event-driven architecture** with listeners
- ✅ **Cross-platform** (iOS & Android)

### Text-to-Speech (TTS)

- ✅ **Convert text to speech** with natural voices
- ✅ **Multi-language support** matching STT
- ✅ **Play/Stop controls**
- ✅ **Speaking state detection**
- ✅ **Event-driven callbacks**
- ✅ **Cross-platform** (iOS & Android)

### Supported Languages

- 🇺🇸 English (US, GB, AU, IN)
- 🇮🇳 Hindi (India)
- 🇪🇸 Spanish (Spain)
- 🇫🇷 French (France)
- 🇩🇪 German (Germany)
- 🇮🇹 Italian (Italy)
- 🇧🇷 Portuguese (Brazil)
- 🇷🇺 Russian (Russia)
- 🇯🇵 Japanese (Japan)
- 🇰🇷 Korean (Korea)
- 🇨🇳 Chinese (China)
- 🇸🇦 Arabic (Saudi Arabia)

## 📦 Installation

```bash
npm install react-native-voice-text-live
# or
yarn add react-native-voice-text-live
```

### For Expo Managed Workflow

```bash
npx expo prebuild
```

### For Bare React Native

```bash
npx pod-install
```

## 🔧 Configuration

### Android

Add microphone permission to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### iOS

Add microphone and speech recognition permissions to `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for speech recognition</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs speech recognition for transcription</string>
```

## 📖 Usage

### Basic Example

```typescript
import React, { useState, useEffect } from 'react';
import {
  requestPermissions,
  start,
  stop,
  speak,
  stopSpeaking,
  addSpeechResultListener,
  addSpeechErrorListener,
  addTTSCompleteListener,
} from 'react-native-voice-text-live';

function App() {
  const [transcription, setTranscription] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Request permissions
    requestPermissions();

    // Listen to speech results
    const resultSub = addSpeechResultListener((event) => {
      if (event.isFinal) {
        setTranscription(prev => prev + ' ' + event.text);
      }
    });

    // Listen to TTS completion
    const ttsSub = addTTSCompleteListener(() => {
      setIsSpeaking(false);
    });

    return () => {
      resultSub.remove();
      ttsSub.remove();
    };
  }, []);

  const startRecording = async () => {
    await start('en-US');
  };

  const speakText = async () => {
    setIsSpeaking(true);
    await speak(transcription, 'en-US');
  };

  return (
    <View>
      <Text>{transcription}</Text>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Speak Text" onPress={speakText} disabled={isSpeaking} />
    </View>
  );
}
```

## 🎯 API Reference

### Permissions

#### `requestPermissions(): Promise<PermissionResult>`

Request microphone and speech recognition permissions.

**Returns:** `'granted' | 'denied'`

```typescript
const status = await requestPermissions();
if (status === "granted") {
  // Ready to use
}
```

---

### Speech Recognition (Speech-to-Text)

#### `start(language?: SupportedLanguage): Promise<void>`

Start speech recognition with optional language.

**Parameters:**

- `language` (optional): Language code (default: 'en-US')

```typescript
await start("hi-IN"); // Hindi
await start("es-ES"); // Spanish
await start(); // Default: en-US
```

#### `stop(): Promise<void>`

Stop speech recognition.

```typescript
await stop();
```

#### `pause(): Promise<void>`

Pause audio level monitoring (Android only).

```typescript
await pause();
```

#### `resume(): Promise<void>`

Resume audio level monitoring (Android only).

```typescript
await resume();
```

---

### Text-to-Speech (TTS)

#### `speak(text: string, language?: SupportedLanguage): Promise<void>`

Convert text to speech.

**Parameters:**

- `text`: Text to speak
- `language` (optional): Language code (default: 'en-US')

```typescript
await speak("Hello, how are you?", "en-US");
await speak("नमस्ते, आप कैसे हैं?", "hi-IN");
```

#### `stopSpeaking(): Promise<void>`

Stop text-to-speech playback.

```typescript
await stopSpeaking();
```

#### `isSpeaking(): Promise<boolean>`

Check if TTS is currently speaking.

```typescript
const speaking = await isSpeaking();
```

---

### Event Listeners

#### Speech Recognition Events

##### `addSpeechResultListener(callback: (event: SpeechResultEventPayload) => void): EventSubscription`

Listen to speech recognition results (partial and final).

**Event Payload:**

```typescript
{
  text: string;      // Transcribed text
  isFinal?: boolean; // true for final results, false for partial
}
```

**Example:**

```typescript
const subscription = addSpeechResultListener((event) => {
  if (event.isFinal) {
    console.log("Final:", event.text);
  } else {
    console.log("Partial:", event.text);
  }
});

// Cleanup
subscription.remove();
```

##### `addSpeechErrorListener(callback: (event: SpeechErrorEventPayload) => void): EventSubscription`

Listen to speech recognition errors.

**Event Payload:**

```typescript
{
  error: string; // Error message
}
```

##### `addSpeechStartListener(callback: (event: SpeechStartEventPayload) => void): EventSubscription`

Fired when speech recognition starts.

**Event Payload:**

```typescript
{
  timestamp: number; // Unix timestamp in milliseconds
}
```

##### `addSpeechEndListener(callback: (event: SpeechEndEventPayload) => void): EventSubscription`

Fired when speech recognition ends.

**Event Payload:**

```typescript
{
  timestamp: number; // Unix timestamp in milliseconds
}
```

##### `addAudioLevelListener(callback: (event: AudioLevelEventPayload) => void): EventSubscription`

Monitor audio input levels (Android only).

**Event Payload:**

```typescript
{
  level: number; // RMS dB value
}
```

#### Text-to-Speech Events

##### `addTTSStartListener(callback: (event: TTSStartEventPayload) => void): EventSubscription`

Fired when TTS starts speaking.

**Event Payload:**

```typescript
{
  timestamp: number; // Unix timestamp in milliseconds
}
```

##### `addTTSCompleteListener(callback: (event: TTSCompleteEventPayload) => void): EventSubscription`

Fired when TTS finishes speaking.

**Event Payload:**

```typescript
{
  timestamp: number; // Unix timestamp in milliseconds
}
```

##### `addTTSErrorListener(callback: (event: TTSErrorEventPayload) => void): EventSubscription`

Fired on TTS errors.

**Event Payload:**

```typescript
{
  error: string; // Error message
}
```

---

## 🌍 Language Constants

Use predefined language constants for better type safety:

```typescript
import { SUPPORTED_LANGUAGES } from "react-native-voice-text-live";

await start(SUPPORTED_LANGUAGES.HINDI_INDIA);
await speak("Hello", SUPPORTED_LANGUAGES.ENGLISH_US);
```

Available constants:

- `ENGLISH_US`, `ENGLISH_UK`, `ENGLISH_AUSTRALIA`, `ENGLISH_INDIA`
- `HINDI_INDIA`
- `SPANISH_SPAIN`
- `FRENCH_FRANCE`
- `GERMAN_GERMANY`
- `ITALIAN_ITALY`
- `PORTUGUESE_BRAZIL`
- `RUSSIAN_RUSSIA`
- `JAPANESE_JAPAN`
- `KOREAN_KOREA`
- `CHINESE_CHINA`
- `ARABIC_SAUDI`

---

## 🔥 Advanced Example

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  requestPermissions,
  start,
  stop,
  speak,
  stopSpeaking,
  isSpeaking,
  addSpeechResultListener,
  addSpeechErrorListener,
  addSpeechStartListener,
  addSpeechEndListener,
  addTTSStartListener,
  addTTSCompleteListener,
  addTTSErrorListener,
  addAudioLevelListener,
  SUPPORTED_LANGUAGES,
  PermissionResult,
} from 'react-native-voice-text-live';

export default function VoiceApp() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionResult>('denied');
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [partialText, setPartialText] = useState('');
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    // Request permissions
    const initPermissions = async () => {
      const status = await requestPermissions();
      setPermissionStatus(status);
    };
    initPermissions();

    // Speech Recognition Listeners
    const speechResultSub = addSpeechResultListener((event) => {
      if (event.isFinal) {
        setTranscribedText((prev) => prev + ' ' + event.text);
        setPartialText('');
      } else {
        setPartialText(event.text);
      }
    });

    const speechErrorSub = addSpeechErrorListener((event) => {
      console.error('Speech Error:', event.error);
      setIsListening(false);
    });

    const speechStartSub = addSpeechStartListener((event) => {
      console.log('Speech started at:', new Date(event.timestamp));
      setIsListening(true);
    });

    const speechEndSub = addSpeechEndListener((event) => {
      console.log('Speech ended at:', new Date(event.timestamp));
      setIsListening(false);
    });

    const audioLevelSub = addAudioLevelListener((event) => {
      setAudioLevel(event.level);
    });

    // TTS Listeners
    const ttsStartSub = addTTSStartListener((event) => {
      setIsSpeakingState(true);
    });

    const ttsCompleteSub = addTTSCompleteListener((event) => {
      setIsSpeakingState(false);
    });

    const ttsErrorSub = addTTSErrorListener((event) => {
      console.error('TTS Error:', event.error);
      setIsSpeakingState(false);
    });

    return () => {
      speechResultSub.remove();
      speechErrorSub.remove();
      speechStartSub.remove();
      speechEndSub.remove();
      audioLevelSub.remove();
      ttsStartSub.remove();
      ttsCompleteSub.remove();
      ttsErrorSub.remove();
    };
  }, []);

  const startRecording = async () => {
    try {
      await start(SUPPORTED_LANGUAGES.HINDI_INDIA);
    } catch (error) {
      console.error('Start error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await stop();
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  const speakTranscription = async () => {
    if (!transcribedText) return;
    try {
      await speak(transcribedText, SUPPORTED_LANGUAGES.HINDI_INDIA);
    } catch (error) {
      console.error('Speak error:', error);
    }
  };

  const stopSpeech = async () => {
    try {
      await stopSpeaking();
    } catch (error) {
      console.error('Stop speaking error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice App</Text>

      <Text>Permission: {permissionStatus}</Text>
      <Text>Listening: {isListening ? 'Yes' : 'No'}</Text>
      <Text>Speaking: {isSpeakingState ? 'Yes' : 'No'}</Text>
      <Text>Audio Level: {audioLevel.toFixed(2)} dB</Text>

      <View style={styles.textContainer}>
        <Text style={styles.finalText}>{transcribedText}</Text>
        <Text style={styles.partialText}>{partialText}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Start" onPress={startRecording} disabled={isListening} />
        <Button title="Stop" onPress={stopRecording} disabled={!isListening} />
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Speak Text"
          onPress={speakTranscription}
          disabled={!transcribedText || isSpeakingState}
        />
        <Button
          title="Stop Speaking"
          onPress={stopSpeech}
          disabled={!isSpeakingState}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  textContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  finalText: { fontSize: 16, color: '#000' },
  partialText: { fontSize: 16, color: '#2196f3', fontStyle: 'italic' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
```

---

## 🛠️ Troubleshooting

### Android

**Issue:** "Speech recognition not available"

- Ensure Google app is installed and updated
- Check that device has internet connection
- Verify microphone permissions are granted

**Issue:** TTS not working

- Ensure Google Text-to-Speech engine is installed
- Check device language settings

### iOS

**Issue:** "Speech recognizer not available"

- Check iOS version (requires iOS 10+)
- Verify speech recognition permission in Settings
- Ensure active internet connection

**Issue:** TTS not working

- Check iOS version (requires iOS 7+)
- Verify language voice data is downloaded in Settings > Accessibility > Spoken Content > Voices

---

## 📝 TypeScript Support

This package is written in TypeScript and includes complete type definitions.

```typescript
import type {
  PermissionResult,
  SupportedLanguage,
  SpeechResultEventPayload,
  SpeechErrorEventPayload,
  SpeechStartEventPayload,
  SpeechEndEventPayload,
  AudioLevelEventPayload,
  TTSStartEventPayload,
  TTSCompleteEventPayload,
  TTSErrorEventPayload,
} from "react-native-voice-text-live";
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT

---

## 🙏 Credits

Developed by [@SikendarKumarJavascript](https://github.com/SikendarKumarJavascript)

---

## 📧 Support

For issues and feature requests, please use [GitHub Issues](https://github.com/SikendarKumarJavascript/react-native-voice-text-live/issues).
