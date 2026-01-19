import * as React from 'react';

import { ExpoCustomSpeechViewProps } from './ExpoCustomSpeech.types';

export default function ExpoCustomSpeechView(props: ExpoCustomSpeechViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
