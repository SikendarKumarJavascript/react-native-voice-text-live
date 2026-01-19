import * as React from 'react';
export default function ExpoCustomSpeechView(props) {
    return (<div>
      <iframe style={{ flex: 1 }} src={props.url} onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}/>
    </div>);
}
//# sourceMappingURL=ExpoCustomSpeechView.web.js.map