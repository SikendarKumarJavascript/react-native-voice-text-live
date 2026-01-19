import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { 
  requestPermissions, 
  start, 
  stop, 
  speak,
  stopSpeaking,
  isSpeaking,
  addSpeechResultListener, 
  addSpeechErrorListener,
  addSpeechStartListener,
  addSpeechEndListener,
  addTTSStartListener,
  addTTSCompleteListener,
  addTTSErrorListener,
  PermissionResult 
} from 'react-native-voice-text-live';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState(''); // Permanent accumulated text
  const [currentText, setCurrentText] = useState(''); // Live/partial text being spoken
  const [permissionStatus, setPermissionStatus] = useState<PermissionResult>('denied');
  const [isSpeakingState, setIsSpeakingState] = useState(false);

  useEffect(() => {
    let speechResultSubscription: { remove: () => void } | null = null;
    let speechErrorSubscription: { remove: () => void } | null = null;
    let speechStartSubscription: { remove: () => void } | null = null;
    let speechEndSubscription: { remove: () => void } | null = null;
    let ttsStartSubscription: { remove: () => void } | null = null;
    let ttsCompleteSubscription: { remove: () => void } | null = null;
    let ttsErrorSubscription: { remove: () => void } | null = null;

    // Set up event listeners
    speechResultSubscription = addSpeechResultListener((event) => {
      
      if (event.isFinal) {
        // Final result - add to permanent text
        setTranscribedText((prevText) => {
          if (prevText) {
            return prevText + ' ' + event.text;
          }
          return event.text;
        });
        setCurrentText(''); // Clear current/live text
      } else {
        // Partial result - show as live text
        setCurrentText(event.text);
      }
    });

    speechErrorSubscription = addSpeechErrorListener((event) => {
      console.error('Speech recognition error:', event.error);
      Alert.alert('Speech Error', event.error);
      setIsListening(false);
    });

    speechStartSubscription = addSpeechStartListener((event) => {
      // console.log('🎤 Speech started at:', new Date(event.timestamp).toLocaleTimeString());
      Alert.alert('Speech Started', 'You can start speaking now!');
    });

    speechEndSubscription = addSpeechEndListener((event) => {
      // console.log('🛑 Speech ended at:', new Date(event.timestamp).toLocaleTimeString());
      Alert.alert('Speech Ended', 'Speech recognition stopped');
    });

    // TTS event listeners
    ttsStartSubscription = addTTSStartListener((event) => {
      setIsSpeakingState(true);
    });

    ttsCompleteSubscription = addTTSCompleteListener((event) => {
      setIsSpeakingState(false);
    });

    ttsErrorSubscription = addTTSErrorListener((event) => {
      console.error('TTS error:', event.error);
      Alert.alert('TTS Error', event.error);
      setIsSpeakingState(false);
    });

    return () => {
      speechResultSubscription?.remove();
      speechErrorSubscription?.remove();
      speechStartSubscription?.remove();
      speechEndSubscription?.remove();
      ttsStartSubscription?.remove();
      ttsCompleteSubscription?.remove();
      ttsErrorSubscription?.remove();
    };
  }, []);

  const handleRequestPermissions = async () => {
    try {
      console.log('Requesting permissions...');
      const result = await requestPermissions();
      console.log('Permission result:', result);
      setPermissionStatus(result);
      
      if (result === 'denied') {
        Alert.alert(
          'Permissions Denied',
          'This app needs microphone and speech recognition permissions to work properly. Please grant permissions in your device settings.'
        );
      } else if (result === 'granted') {
        Alert.alert(
          'Permissions Granted',
          'You can now start using speech recognition!'
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions. Please try again.');
    }
  };

  const startListening = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant permissions first by tapping "Request Permissions".'
      );
      return;
    }

    try {
      // Don't clear text - accumulate continuously
      await start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      Alert.alert('Error', 'Failed to start speech recognition');
    }
  };

  const stopListening = async () => {
    try {
      await stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const clearText = () => {
    setTranscribedText('');
    setCurrentText('');
  };

  const handleSpeak = async () => {
    if (!transcribedText) {
      Alert.alert('No Text', 'Please transcribe some text first before using text-to-speech.');
      return;
    }

    try {
      await speak(transcribedText);
    } catch (error) {
      console.error('Error speaking text:', error);
      Alert.alert('TTS Error', 'Failed to speak text');
    }
  };

  const handleStopSpeaking = async () => {
    try {
      await stopSpeaking();
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Speech-to-Text Demo</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Permission Status: {permissionStatus}
          </Text>
          <Text style={styles.statusText}>
            Listening: {isListening ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Transcribed Text:</Text>
          <Text style={styles.transcriptionText}>
            {transcribedText || 'Start listening to see transcribed text here...'}
            {currentText && (
              <Text style={styles.liveText}> {currentText}</Text>
            )}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.startButton,
              { opacity: isListening ? 0.5 : 1 }
            ]}
            onPress={permissionStatus !== 'granted' ? handleRequestPermissions : startListening}
            disabled={isListening}
          >
            <Text style={styles.buttonText}>
              {permissionStatus !== 'granted' ? 'Request Permissions' : 'Start Listening'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.stopButton,
              { opacity: !isListening ? 0.5 : 1 }
            ]}
            onPress={stopListening}
            disabled={!isListening}
          >
            <Text style={styles.buttonText}>Stop Listening</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.clearButton, styles.fullWidthButton]}
          onPress={clearText}
        >
          <Text style={styles.buttonText}>Clear Text</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.speakButton,
              { opacity: (!transcribedText || isSpeakingState) ? 0.5 : 1 }
            ]}
            onPress={handleSpeak}
            disabled={!transcribedText || isSpeakingState}
          >
            <Text style={styles.buttonText}>🔊 Speak Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.stopSpeakButton,
              { opacity: !isSpeakingState ? 0.5 : 1 }
            ]}
            onPress={handleStopSpeaking}
            disabled={!isSpeakingState}
          >
            <Text style={styles.buttonText}>⏹ Stop Speaking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>
            1. Tap "Request Permissions" if needed
          </Text>
          <Text style={styles.instructionText}>
            2. Tap "Start Listening" to begin speech recognition
          </Text>
          <Text style={styles.instructionText}>
            3. Speak clearly into your device's microphone
          </Text>
          <Text style={styles.instructionText}>
            4. Tap "Stop Listening" when done
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  transcriptionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transcriptionText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
  },
  liveText: {
    color: '#2196f3',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  clearButton: {
    backgroundColor: '#FF9800',
    marginBottom: 20,
  },
  fullWidthButton: {
    flex: 0,
    width: '100%',
    marginHorizontal: 0,
  },
  speakButton: {
    backgroundColor: '#2196f3',
  },
  stopSpeakButton: {
    backgroundColor: '#607d8b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#424242',
  },
});
