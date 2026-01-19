import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { 
  requestPermissions, 
  start, 
  stop, 
  addSpeechResultListener, 
  addSpeechErrorListener,
  PermissionResult 
} from 'react-native-voice-text-live';

export default function SpeechToTextExample() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<PermissionResult>('denied');

  useEffect(() => {
    let speechResultSubscription: any = null;
    let speechErrorSubscription: any = null;

    // Set up event listeners
    speechResultSubscription = addSpeechResultListener((event) => {
      setTranscribedText(event.text);
    });

    speechErrorSubscription = addSpeechErrorListener((event) => {
      console.error('Speech recognition error:', event.error);
      Alert.alert('Speech Error', event.error);
      setIsListening(false);
    });

    // Check permissions on mount
    checkPermissions();

    return () => {
      speechResultSubscription?.remove();
      speechErrorSubscription?.remove();
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const result = await requestPermissions();
      setPermissionStatus(result);
      if (result === 'denied') {
        Alert.alert(
          'Permissions Required',
          'This app needs microphone and speech recognition permissions to work properly.'
        );
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const startListening = async () => {
    if (permissionStatus !== 'granted') {
      await checkPermissions();
      return;
    }

    try {
      setTranscribedText('');
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

  return (
    <View style={styles.container}>
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
          {transcribedText || 'No text yet...'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.startButton,
            { opacity: isListening ? 0.5 : 1 }
          ]}
          onPress={startListening}
          disabled={isListening || permissionStatus !== 'granted'}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});