import { NativeModule } from 'expo';
import { ExpoCustomSpeechModuleEvents, PermissionResult } from './ExpoCustomSpeech.types';
declare class ExpoCustomSpeechModule extends NativeModule<ExpoCustomSpeechModuleEvents> {
    PI: number;
    hello(): string;
    setValueAsync(value: string): Promise<void>;
    requestPermissions(): Promise<PermissionResult>;
    start(language?: string): Promise<void>;
    stop(): Promise<void>;
    speak(text: string, language?: string): Promise<void>;
    stopSpeaking(): Promise<void>;
    isSpeaking(): Promise<boolean>;
}
declare const _default: ExpoCustomSpeechModule;
export default _default;
//# sourceMappingURL=ExpoCustomSpeechModule.d.ts.map