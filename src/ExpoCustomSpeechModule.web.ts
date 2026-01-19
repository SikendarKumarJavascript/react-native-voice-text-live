import { registerWebModule, NativeModule } from 'expo';

import { ExpoCustomSpeechModuleEvents, PermissionResult } from './ExpoCustomSpeech.types';

// Declare global SpeechRecognition interface for TypeScript
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
  new(): SpeechRecognition;
};

class ExpoCustomSpeechModule extends NativeModule<ExpoCustomSpeechModuleEvents> {
  PI = Math.PI;
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  async setValueAsync(value: string): Promise<void> {
    // Emit a speech result instead of onChange for consistency
    this.emit('onSpeechResult', { text: value });
  }

  hello() {
    return 'Hello world! 👋';
  }

  async requestPermissions(): Promise<PermissionResult> {
    // Check if Web Speech API is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return 'denied';
    }

    // For web, we'll return granted as permission is handled by the browser
    // The browser will show its own permission prompt when starting recognition
    return 'granted';
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if Web Speech API is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.recognition = new SpeechRecognition();
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          resolve();
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Emit the most recent result (final or interim)
          const text = finalTranscript || interimTranscript;
          if (text) {
            this.emit('onSpeechResult', { text });
          }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          this.isListening = false;
          this.emit('onSpeechError', { error: `Speech recognition error: ${event.error}` });
          reject(new Error(`Speech recognition error: ${event.error}`));
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };

        try {
          this.recognition.start();
        } catch (error) {
          this.isListening = false;
          reject(error);
        }
      } else {
        reject(new Error('Failed to create SpeechRecognition instance'));
      }
    });
  }

  async stop(): Promise<void> {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export default registerWebModule(ExpoCustomSpeechModule, 'ExpoCustomSpeechModule');
