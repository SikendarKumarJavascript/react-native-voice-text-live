# Speech Recognition Troubleshooting Guide

## Common Errors and Solutions

### iOS Errors

#### ✅ "No match found" - NORMAL ERROR

**When it happens:**

- Jab aap baat nahi karte ya microphone kuch capture nahi kar pata
- Background noise bahut zyada ho
- Bohot dhimmi awaaz ho

**Solution:**

- Yeh error normal hai, alert show nahi hona chahiye
- App ko automatically listening state mein rehna chahiye
- User fir se try kar sake

**Already Fixed:** Updated example app to ignore this error

#### ✅ "Unknown error: 11" - SPEECH TIMEOUT

**Description:** iOS speech recognition timeout error
**When it happens:**

- Jab bohot lamba waqt tak koi speech input nahi milta
- Network issue ho (iOS uses server-side recognition)

**Solution:**

- User ko fir se "Start Listening" press karna hoga
- Check karein internet connection stable hai

**Already Fixed:** Updated example app to ignore this error

#### ⚠️ "Audio recording error"

**Solution:**

1. Check microphone permissions in Settings
2. Close other apps using microphone
3. Restart app

### Android Errors

#### ✅ "No match found" - NORMAL ERROR

Same as iOS - yeh normal operational error hai

**Already Fixed:** Updated example app to ignore this error

#### ⚠️ "Network error" / "Network timeout"

**Cause:** Android speech recognition needs internet connection
**Solution:**

1. Check internet connection
2. Try both WiFi and mobile data
3. Check if Google app is updated

#### ⚠️ "RecognitionService busy"

**Cause:** Another app is using speech recognition
**Solution:**

1. Close Google Assistant
2. Close other apps with voice input
3. Restart phone if needed

#### ⚠️ "Insufficient permissions"

**Solution:**

```javascript
// Always request permissions first
const permission = await requestPermissions();
if (permission !== "granted") {
  Alert.alert("Permission Required", "Please grant microphone permission");
}
```

## Best Practices

### 1. Error Handling in Your App

```tsx
addSpeechErrorListener((event) => {
  console.log("Speech error:", event.error);

  // Filter out operational errors
  const isOperationalError =
    event.error.includes("No match found") ||
    event.error.includes("Unknown error: 11") ||
    event.error.includes("No speech input");

  if (!isOperationalError) {
    // Show alert only for real errors
    Alert.alert("Error", event.error);
    setIsListening(false);
  }
});
```

### 2. Continuous Listening Pattern

```tsx
const [isListening, setIsListening] = useState(false);

// Auto-restart on end
addSpeechEndListener(async (event) => {
  if (isListening) {
    // Restart listening for continuous recognition
    setTimeout(() => {
      start().catch(console.error);
    }, 500);
  }
});

// Stop only on real errors
addSpeechErrorListener((event) => {
  const shouldStop = !event.error.includes("No match found");
  if (shouldStop) {
    setIsListening(false);
  }
});
```

### 3. Better User Feedback

```tsx
const [status, setStatus] = useState("Ready");

addSpeechStartListener(() => setStatus("Listening..."));
addSpeechEndListener(() => setStatus("Processing..."));
addSpeechErrorListener((event) => {
  if (event.error.includes("No match found")) {
    setStatus("Ready - Try speaking");
  } else {
    setStatus("Error: " + event.error);
  }
});
```

## Platform Differences

| Feature                    | iOS                   | Android               |
| -------------------------- | --------------------- | --------------------- |
| **Internet Required**      | Yes (Apple servers)   | Yes (Google servers)  |
| **Offline Mode**           | Not supported         | Depends on device     |
| **Continuous Recognition** | Manual restart needed | Manual restart needed |
| **Timeout**                | ~10-15 seconds        | ~10-15 seconds        |
| **Partial Results**        | Yes                   | Yes                   |

## Testing Tips

### Real Device Testing (Recommended)

```bash
# iOS
npx expo run:ios --device

# Android
npx expo run:android --device
```

### Simulator Limitations

- **iOS Simulator:** Microphone works but recognition quality may vary
- **Android Emulator:** May need virtual audio input setup

### Testing Checklist

- [ ] Permissions granted
- [ ] Internet connection active
- [ ] Quiet environment
- [ ] Speak clearly and not too fast
- [ ] Test multiple languages
- [ ] Test continuous recognition
- [ ] Test error scenarios

## Performance Optimization

### 1. Reduce Alert Spam

```tsx
// Don't show alerts for every error
const criticalErrors = [
  "Audio recording error",
  "Insufficient permissions",
  "Speech recognition not available",
];

if (criticalErrors.some((err) => event.error.includes(err))) {
  Alert.alert("Error", event.error);
}
```

### 2. Debounce Speech Start

```tsx
let speechStartTimeout;
addSpeechStartListener(() => {
  clearTimeout(speechStartTimeout);
  speechStartTimeout = setTimeout(() => {
    Alert.alert("Ready", "You can speak now");
  }, 300);
});
```

### 3. Memory Management

```tsx
useEffect(() => {
  const subscriptions = [
    addSpeechResultListener(handler),
    addSpeechErrorListener(handler),
    // ... more listeners
  ];

  return () => {
    subscriptions.forEach((sub) => sub.remove());
    stop(); // Clean up recognizer
  };
}, []);
```

## FAQ

**Q: Why do I get "No match found" so often?**  
A: This is normal. Speech recognition expects clear speech. Silence, background noise, or unclear speech triggers this.

**Q: Can I use this offline?**  
A: No, both iOS and Android use server-side speech recognition requiring internet.

**Q: How long can I record?**  
A: Typically 10-15 seconds per session. For longer, restart recognition periodically.

**Q: Why does recognition stop automatically?**  
A: Both platforms auto-stop after silence detection. Implement auto-restart for continuous mode.

**Q: Can I customize the language?**  
A: Yes! Pass language code to start():

```tsx
await start("hi-IN"); // Hindi
await start("es-ES"); // Spanish
```

## Support

If issues persist:

1. Check [GitHub Issues](https://github.com/SikendarKumarJavascript/react-native-voice-text-live/issues)
2. Provide error logs from console
3. Mention device model and OS version
4. Share sample code reproducing the issue
