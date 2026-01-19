import { NativeModule } from 'expo';
import { ExpoCustomSpeechModuleEvents, PermissionResult } from './ExpoCustomSpeech.types';
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}
interface SpeechRecognitionResult {
    0: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}
interface SpeechRecognitionAlternative {
    confidence: number;
    transcript: string;
}
interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    start(): void;
    stop(): void;
}
declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
};
declare class ExpoCustomSpeechModule extends NativeModule<ExpoCustomSpeechModuleEvents> {
    PI: number;
    private recognition;
    private isListening;
    setValueAsync(value: string): Promise<void>;
    hello(): string;
    requestPermissions(): Promise<PermissionResult>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
declare const _default: typeof ExpoCustomSpeechModule;
export default _default;
//# sourceMappingURL=ExpoCustomSpeechModule.web.d.ts.map