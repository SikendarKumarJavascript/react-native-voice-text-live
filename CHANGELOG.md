# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-19

### Added

- 🎙️ Speech-to-Text (STT) functionality
  - Real-time speech recognition with partial and final results
  - Multi-language support (15+ languages)
  - Audio level monitoring (Android)
  - Start/Stop/Pause/Resume controls
  - Event listeners for speech start, end, results, and errors
- 🔊 Text-to-Speech (TTS) functionality
  - Convert text to natural speech
  - Multi-language voice support
  - Play/Stop controls
  - Speaking state detection
  - Event listeners for TTS lifecycle
- 🌍 Multi-language Support
  - English (US, GB, AU, IN)
  - Hindi (India)
  - Spanish (Spain)
  - French (France)
  - German (Germany)
  - Italian (Italy)
  - Portuguese (Brazil)
  - Russian (Russia)
  - Japanese (Japan)
  - Korean (Korea)
  - Chinese (China)
  - Arabic (Saudi Arabia)
- 📱 Cross-platform Implementation
  - iOS implementation using SFSpeechRecognizer and AVSpeechSynthesizer
  - Android implementation using SpeechRecognizer and TextToSpeech
- 🎯 TypeScript Support
  - Complete type definitions
  - Type-safe API
  - IntelliSense support
- 📚 Documentation
  - Comprehensive API documentation
  - Usage examples
  - Troubleshooting guide
  - Platform-specific notes

### Platform Support

- iOS 10.0+
- Android API 24+
- React Native 0.74+
- Expo SDK 52+

## [Unreleased]

### Planned Features

- Offline speech recognition support
- Custom wake words
- Voice activity detection
- Speech translation
- Voice biometrics
- Custom TTS voices

---

For upgrade instructions and migration guides, see the [README.md](./README.md).
