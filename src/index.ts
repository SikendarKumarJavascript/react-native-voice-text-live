import { EventSubscription, Platform } from 'expo-modules-core';
import { PermissionsAndroid } from 'react-native';
import ExpoCustomSpeechModule from './ExpoCustomSpeechModule';
import { 
  SpeechResultEventPayload, 
  SpeechErrorEventPayload, 
  SpeechStartEventPayload,
  SpeechEndEventPayload,
  AudioLevelEventPayload,
  TTSStartEventPayload,
  TTSCompleteEventPayload,
  TTSErrorEventPayload,
  SupportedLanguage,
  PermissionResult 
} from './ExpoCustomSpeech.types';

// Speech Recognition API
export async function requestPermissions(): Promise<PermissionResult> {
  // On Android, we need to explicitly request the permission
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone for speech recognition',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return 'granted';
      } else {
        return 'denied';
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return 'denied';
    }
  }
  
  // On iOS and other platforms, use the native module
  return await ExpoCustomSpeechModule.requestPermissions();
}

export async function start(language?: SupportedLanguage): Promise<void> {
  return await ExpoCustomSpeechModule.start(language || 'en-US');
}

export async function stop(): Promise<void> {
  return await ExpoCustomSpeechModule.stop();
}

export async function pause(): Promise<void> {
  return await ExpoCustomSpeechModule.pause();
}

export async function resume(): Promise<void> {
  return await ExpoCustomSpeechModule.resume();
}

// Event Listeners
export function addSpeechResultListener(
  listener: (event: SpeechResultEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onSpeechResult', listener);
}

export function addSpeechErrorListener(
  listener: (event: SpeechErrorEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onSpeechError', listener);
}

export function addSpeechStartListener(
  listener: (event: SpeechStartEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onSpeechStart', listener);
}

export function addSpeechEndListener(
  listener: (event: SpeechEndEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onSpeechEnd', listener);
}

export function addAudioLevelListener(
  listener: (event: AudioLevelEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onAudioLevel', listener);
}

// Text-to-Speech API
export async function speak(text: string, language?: SupportedLanguage): Promise<void> {
  return await ExpoCustomSpeechModule.speak(text, language || 'en-US');
}

export async function stopSpeaking(): Promise<void> {
  return await ExpoCustomSpeechModule.stopSpeaking();
}

export async function isSpeaking(): Promise<boolean> {
  return await ExpoCustomSpeechModule.isSpeaking();
}

// TTS Event Listeners
export function addTTSStartListener(
  listener: (event: TTSStartEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onTTSStart', listener);
}

export function addTTSCompleteListener(
  listener: (event: TTSCompleteEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onTTSComplete', listener);
}

export function addTTSErrorListener(
  listener: (event: TTSErrorEventPayload) => void
): EventSubscription {
  return ExpoCustomSpeechModule.addListener('onTTSError', listener);
}

// Export supported languages constant
export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguage> = {
  ENGLISH_US: 'en-US',
  ENGLISH_UK: 'en-GB',
  ENGLISH_AUSTRALIA: 'en-AU',
  ENGLISH_INDIA: 'en-IN',
  HINDI_INDIA: 'hi-IN',
  SPANISH_SPAIN: 'es-ES',
  FRENCH_FRANCE: 'fr-FR',
  GERMAN_GERMANY: 'de-DE',
  ITALIAN_ITALY: 'it-IT',
  PORTUGUESE_BRAZIL: 'pt-BR',
  RUSSIAN_RUSSIA: 'ru-RU',
  JAPANESE_JAPAN: 'ja-JP',
  KOREAN_KOREA: 'ko-KR',
  CHINESE_CHINA: 'zh-CN',
  ARABIC_SAUDI: 'ar-SA',
};

// Reexport the native module
export { default } from './ExpoCustomSpeechModule';
export { default as ExpoCustomSpeechView } from './ExpoCustomSpeechView';
export * from './ExpoCustomSpeech.types';
