import * as React from 'react';

import { NotificationNative2ViewProps } from './NotificationNative2.types';

export default function NotificationNative2View(props: NotificationNative2ViewProps) {
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
