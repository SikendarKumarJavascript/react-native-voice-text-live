# react-native-voice-text-live

🎤 Complete speech recognition and text-to-speech solution for React Native and Expo apps with real-time transcription and multi-language support.

[![npm version](https://badge.fury.io/js/react-native-voice-text-live.svg)](https://www.npmjs.com/package/react-native-voice-text-live)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎙️ **Real-time Speech-to-Text** with partial and final results
- 🔊 **Text-to-Speech** with natural voices
- 🌍 **Multi-language Support** (15+ languages)
- 📊 **Audio Level Monitoring** (Android)
- ⏯️ **Full Playback Control** (play, pause, stop)
- 📱 **Cross-platform** (iOS & Android)
- 🎯 **TypeScript Support** with complete type definitions
- ⚡ **Event-driven Architecture** for reactive UI updates

## 📦 Installation

### From GitHub (Recommended)

```bash
npm install github:SikendarKumarJavascript/react-native-voice-text-live
# or
yarn add github:SikendarKumarJavascript/react-native-voice-text-live
```

**Install specific version:**

```bash
npm install github:SikendarKumarJavascript/react-native-voice-text-live#v1.2.0
```

### From NPM (Coming Soon)

```bash
npm install react-native-voice-text-live
# or
yarn add react-native-voice-text-live
```

### For Expo Projects

```bash
npx expo prebuild
```

### For Bare React Native

```bash
npx pod-install
```

## 🚀 Quick Start

### Basic Example

```typescript
import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import {
  requestPermissions,
  start,
  stop,
  speak,
  addSpeechResultListener,
} from 'react-native-voice-text-live';

export default function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    requestPermissions();

    const sub = addSpeechResultListener((event) => {
      if (event.isFinal) {
        setText(prev => prev + ' ' + event.text);
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <View>
      <Text>{text}</Text>
      <Button title="Start Recording" onPress={() => start('en-US')} />
      <Button title="Speak Text" onPress={() => speak(text, 'en-US')} />
    </View>
  );
}
```

### Complete Example with All Features

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
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
  PermissionResult
} from 'react-native-voice-text-live';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<PermissionResult>('denied');
  const [isSpeakingState, setIsSpeakingState] = useState(false);

  useEffect(() => {
    // Set up all event listeners
    const speechResultSub = addSpeechResultListener((event) => {
      if (event.isFinal) {
        setTranscribedText((prev) => prev ? prev + ' ' + event.text : event.text);
        setCurrentText('');
      } else {
        setCurrentText(event.text);
      }
    });

    const speechErrorSub = addSpeechErrorListener((event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
    });

    const speechStartSub = addSpeechStartListener(() => {
      console.log('Speech started');
    });

    const speechEndSub = addSpeechEndListener(() => {
      console.log('Speech ended');
    });

    const ttsStartSub = addTTSStartListener(() => {
      setIsSpeakingState(true);
    });

    const ttsCompleteSub = addTTSCompleteListener(() => {
      setIsSpeakingState(false);
    });

    const ttsErrorSub = addTTSErrorListener((event) => {
      console.error('TTS error:', event.error);
      setIsSpeakingState(false);
    });

    return () => {
      speechResultSub?.remove();
      speechErrorSub?.remove();
      speechStartSub?.remove();
      speechEndSub?.remove();
      ttsStartSub?.remove();
      ttsCompleteSub?.remove();
      ttsErrorSub?.remove();
    };
  }, []);

  const handleRequestPermissions = async () => {
    const result = await requestPermissions();
    setPermissionStatus(result);
  };

  const startListening = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('Permissions Required', 'Please grant permissions first.');
      return;
    }
    await start();
    setIsListening(true);
  };

  const stopListening = async () => {
    await stop();
    setIsListening(false);
  };

  const handleSpeak = async () => {
    if (!transcribedText) return;
    await speak(transcribedText);
  };

  const handleStopSpeaking = async () => {
    await stopSpeaking();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Speech-to-Text Demo</Text>

        <View style={styles.statusContainer}>
          <Text>Permission: {permissionStatus}</Text>
          <Text>Listening: {isListening ? 'Yes' : 'No'}</Text>
          <Text>Speaking: {isSpeakingState ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Transcribed Text:</Text>
          <Text style={styles.transcriptionText}>
            {transcribedText || 'Start listening...'}
            {currentText && <Text style={styles.liveText}> {currentText}</Text>}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={permissionStatus !== 'granted' ? handleRequestPermissions : startListening}
          disabled={isListening}
        >
          <Text style={styles.buttonText}>
            {permissionStatus !== 'granted' ? 'Request Permissions' : 'Start Listening'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopListening}
          disabled={!isListening}
        >
          <Text style={styles.buttonText}>Stop Listening</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.speakButton]}
          onPress={handleSpeak}
          disabled={!transcribedText || isSpeakingState}
        >
          <Text style={styles.buttonText}>🔊 Speak Text</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopSpeakButton]}
          onPress={handleStopSpeaking}
          disabled={!isSpeakingState}
        >
          <Text style={styles.buttonText}>⏹ Stop Speaking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  statusContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  transcriptionContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 30, minHeight: 120 },
  transcriptionLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  transcriptionText: { fontSize: 18, lineHeight: 24 },
  liveText: { color: '#2196f3', fontStyle: 'italic' },
  button: { padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  startButton: { backgroundColor: '#4CAF50' },
  stopButton: { backgroundColor: '#f44336' },
  speakButton: { backgroundColor: '#2196f3' },
  stopSpeakButton: { backgroundColor: '#607d8b' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
```

> [!TIP]
> For the complete working example with full styling and all features, check out [`example/App.tsx`](./example/App.tsx)

## 🌍 Supported Languages

🇺🇸 English (US, GB, AU, IN) • 🇮🇳 Hindi • 🇪🇸 Spanish • 🇫🇷 French • 🇩🇪 German • 🇮🇹 Italian • 🇧🇷 Portuguese • 🇷🇺 Russian • 🇯🇵 Japanese • 🇰🇷 Korean • 🇨🇳 Chinese • 🇸🇦 Arabic

## 📖 Documentation

For complete documentation, see [SPEECH_CONFIGURATION.md](./SPEECH_CONFIGURATION.md)

### Key APIs

#### Speech Recognition

```typescript
// Start recording
await start("en-US");

// Stop recording
await stop();

// Listen to results
addSpeechResultListener((event) => {
  console.log(event.text, event.isFinal);
});
```

#### Text-to-Speech

```typescript
// Speak text
await speak("Hello World", "en-US");

// Stop speaking
await stopSpeaking();

// Check if speaking
const speaking = await isSpeaking();
```

## ⚙️ Configuration

### iOS (Info.plist)

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for speech recognition</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need speech recognition for transcription</string>
```

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## 🎯 Example App

Check out the complete example app in the `example/` directory:

```bash
cd example
yarn install
yarn android  # or yarn ios
```

## 📝 TypeScript

Fully typed with TypeScript:

```typescript
import type {
  PermissionResult,
  SupportedLanguage,
  SpeechResultEventPayload,
  TTSCompleteEventPayload,
} from "react-native-voice-text-live";
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Sikendar Kumar](https://github.com/SikendarKumarJavascript)

## 🙏 Support

If you find this package helpful, please consider giving it a ⭐ on [GitHub](https://github.com/SikendarKumarJavascript/react-native-voice-text-live)!

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/SikendarKumarJavascript/react-native-voice-text-live/issues).
