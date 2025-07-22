import { requireNativeView } from 'expo';
import * as React from 'react';

import { NotificationNative2ViewProps } from './NotificationNative2.types';

const NativeView: React.ComponentType<NotificationNative2ViewProps> =
  requireNativeView('NotificationNative2');

export default function NotificationNative2View(props: NotificationNative2ViewProps) {
  return <NativeView {...props} />;
}
