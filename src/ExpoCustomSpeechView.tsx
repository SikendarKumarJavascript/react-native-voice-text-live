import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoCustomSpeechViewProps } from './ExpoCustomSpeech.types';

const NativeView: React.ComponentType<ExpoCustomSpeechViewProps> =
  requireNativeView('ExpoCustomSpeech');

export default function ExpoCustomSpeechView(props: ExpoCustomSpeechViewProps) {
  return <NativeView {...props} />;
}
