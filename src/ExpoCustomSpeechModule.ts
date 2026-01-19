import { NativeModule, requireNativeModule } from 'expo';

import { ExpoCustomSpeechModuleEvents, PermissionResult } from './ExpoCustomSpeech.types';

declare class ExpoCustomSpeechModule extends NativeModule<ExpoCustomSpeechModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  
  // Speech Recognition Methods
  requestPermissions(): Promise<PermissionResult>;
  start(language?: string): Promise<void>;
  stop(): Promise<void>;
  
  // Text-to-Speech Methods
  speak(text: string, language?: string): Promise<void>;
  stopSpeaking(): Promise<void>;
  isSpeaking(): Promise<boolean>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoCustomSpeechModule>('ExpoCustomSpeech');
