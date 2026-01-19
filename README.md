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
npm install github:SikendarKumarJavascript/react-native-voice-text-live#v0.1.0
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
