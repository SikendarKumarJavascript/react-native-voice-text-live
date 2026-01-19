import { registerWebModule, NativeModule } from 'expo';
class ExpoCustomSpeechModule extends NativeModule {
    PI = Math.PI;
    recognition = null;
    isListening = false;
    async setValueAsync(value) {
        // Emit a speech result instead of onChange for consistency
        this.emit('onSpeechResult', { text: value });
    }
    hello() {
        return 'Hello world! 👋';
    }
    async requestPermissions() {
        // Check if Web Speech API is available
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return 'denied';
        }
        // For web, we'll return granted as permission is handled by the browser
        // The browser will show its own permission prompt when starting recognition
        return 'granted';
    }
    async start() {
        return new Promise((resolve, reject) => {
            // Check if Web Speech API is available
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
                this.recognition.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        }
                        else {
                            interimTranscript += transcript;
                        }
                    }
                    // Emit the most recent result (final or interim)
                    const text = finalTranscript || interimTranscript;
                    if (text) {
                        this.emit('onSpeechResult', { text });
                    }
                };
                this.recognition.onerror = (event) => {
                    this.isListening = false;
                    this.emit('onSpeechError', { error: `Speech recognition error: ${event.error}` });
                    reject(new Error(`Speech recognition error: ${event.error}`));
                };
                this.recognition.onend = () => {
                    this.isListening = false;
                };
                try {
                    this.recognition.start();
                }
                catch (error) {
                    this.isListening = false;
                    reject(error);
                }
            }
            else {
                reject(new Error('Failed to create SpeechRecognition instance'));
            }
        });
    }
    async stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}
export default registerWebModule(ExpoCustomSpeechModule, 'ExpoCustomSpeechModule');
//# sourceMappingURL=ExpoCustomSpeechModule.web.js.map