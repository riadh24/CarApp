import { NativeModule, requireNativeModule } from 'expo';

import { NotificationNative2ModuleEvents, NotificationPermissionStatus, ScheduledNotification, Vehicle } from './NotificationNative2.types';

declare class NotificationNative2Module extends NativeModule<NotificationNative2ModuleEvents> {
  // Permission methods
  requestPermissions(): Promise<NotificationPermissionStatus>;
  getPermissionStatus(): Promise<NotificationPermissionStatus>;

  // Notification scheduling
  scheduleAuctionNotification(vehicle: Vehicle): Promise<string>;
  cancelNotification(notificationId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;

  // Immediate notifications
  sendImmediateNotification(title: string, body: string, data?: Record<string, any>): Promise<void>;

  // Notification management
  getScheduledNotifications(): Promise<ScheduledNotification[]>;
  getPendingNotifications(): Promise<ScheduledNotification[]>;

  // Background tasks
  enableBackgroundNotifications(): Promise<void>;
  disableBackgroundNotifications(): Promise<void>;

  // Utility
  setBadgeCount(count: number): Promise<void>;
  clearBadge(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<NotificationNative2Module>('NotificationNative2');
