import { Platform } from 'expo-modules-core';
import { PermissionsAndroid } from 'react-native';
import ExpoCustomSpeechModule from './ExpoCustomSpeechModule';
// Speech Recognition API
export async function requestPermissions() {
    // On Android, we need to explicitly request the permission
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
                title: 'Microphone Permission',
                message: 'This app needs access to your microphone for speech recognition',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return 'granted';
            }
            else {
                return 'denied';
            }
        }
        catch (err) {
            console.warn('Permission request error:', err);
            return 'denied';
        }
    }
    // On iOS and other platforms, use the native module
    return await ExpoCustomSpeechModule.requestPermissions();
}
export async function start(language) {
    return await ExpoCustomSpeechModule.start(language || 'en-US');
}
export async function stop() {
    return await ExpoCustomSpeechModule.stop();
}
export async function pause() {
    return await ExpoCustomSpeechModule.pause();
}
export async function resume() {
    return await ExpoCustomSpeechModule.resume();
}
// Event Listeners
export function addSpeechResultListener(listener) {
    return ExpoCustomSpeechModule.addListener('onSpeechResult', listener);
}
export function addSpeechErrorListener(listener) {
    return ExpoCustomSpeechModule.addListener('onSpeechError', listener);
}
export function addSpeechStartListener(listener) {
    return ExpoCustomSpeechModule.addListener('onSpeechStart', listener);
}
export function addSpeechEndListener(listener) {
    return ExpoCustomSpeechModule.addListener('onSpeechEnd', listener);
}
export function addAudioLevelListener(listener) {
    return ExpoCustomSpeechModule.addListener('onAudioLevel', listener);
}
// Text-to-Speech API
export async function speak(text, language) {
    return await ExpoCustomSpeechModule.speak(text, language || 'en-US');
}
export async function stopSpeaking() {
    return await ExpoCustomSpeechModule.stopSpeaking();
}
export async function isSpeaking() {
    return await ExpoCustomSpeechModule.isSpeaking();
}
// TTS Event Listeners
export function addTTSStartListener(listener) {
    return ExpoCustomSpeechModule.addListener('onTTSStart', listener);
}
export function addTTSCompleteListener(listener) {
    return ExpoCustomSpeechModule.addListener('onTTSComplete', listener);
}
export function addTTSErrorListener(listener) {
    return ExpoCustomSpeechModule.addListener('onTTSError', listener);
}
// Export supported languages constant
export const SUPPORTED_LANGUAGES = {
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
//# sourceMappingURL=index.js.map