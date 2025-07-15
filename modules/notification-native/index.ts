// Reexport the native module. On web, it will be resolved to NotificationNative2Module.web.ts
// and on native platforms to NotificationNative2Module.ts
export * from './src/NotificationNative2.types';
export { default } from './src/NotificationNative2Module';
export { default as NotificationNative2View } from './src/NotificationNative2View';

// Export the high-level notification service
export { default as NativeNotificationService } from './src/NativeNotificationService';
