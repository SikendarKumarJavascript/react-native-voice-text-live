import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

// Speech-to-Text Event Types
export type SpeechResultEventPayload = {
  text: string;
  isFinal?: boolean; // true for final results, false for partial results
};

export type SpeechErrorEventPayload = {
  error: string;
};

export type SpeechStartEventPayload = {
  timestamp: number;
};

export type SpeechEndEventPayload = {
  timestamp: number;
};

export type AudioLevelEventPayload = {
  level: number; // RMS dB value
};

// Text-to-Speech Event Types
export type TTSStartEventPayload = {
  timestamp: number;
};

export type TTSCompleteEventPayload = {
  timestamp: number;
};

export type TTSErrorEventPayload = {
  error: string;
};

// Supported languages
export type SupportedLanguage = 
  | 'en-US' | 'en-GB' | 'en-AU' | 'en-IN'
  | 'hi-IN' | 'es-ES' | 'fr-FR' | 'de-DE'
  | 'it-IT' | 'pt-BR' | 'ru-RU' | 'ja-JP'
  | 'ko-KR' | 'zh-CN' | 'ar-SA' | string;

export type ExpoCustomSpeechModuleEvents = {
  onSpeechResult: (params: SpeechResultEventPayload) => void;
  onSpeechError: (params: SpeechErrorEventPayload) => void;
  onSpeechStart: (params: SpeechStartEventPayload) => void;
  onSpeechEnd: (params: SpeechEndEventPayload) => void;
  onAudioLevel: (params: AudioLevelEventPayload) => void;
  onTTSStart: (params: TTSStartEventPayload) => void;
  onTTSComplete: (params: TTSCompleteEventPayload) => void;
  onTTSError: (params: TTSErrorEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoCustomSpeechViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

// Permission request result
export type PermissionResult = 'granted' | 'denied';
