import { NotificationPermissionStatus, ScheduledNotification, Vehicle } from './NotificationNative2.types';
import NotificationNative2Module from './NotificationNative2Module';

/**
 * Native Notification Service that provides car auction notifications
 * with full native capabilities for iOS and Android
 */
class NativeNotificationService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await this.requestPermissions();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize native notifications:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<NotificationPermissionStatus> {
    try {
      return await NotificationNative2Module.requestPermissions();
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return 'denied';
    }
  }

  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      return await NotificationNative2Module.getPermissionStatus();
    } catch (error) {
      console.error('Failed to get permission status:', error);
      return 'undetermined';
    }
  }

  async scheduleAuctionNotification(vehicle: Vehicle): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const permissionStatus = await this.getPermissionStatus();
      if (permissionStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return null;
      }

      return await NotificationNative2Module.scheduleAuctionNotification(vehicle);
    } catch (error) {
      console.error('Failed to schedule auction notification:', error);
      return null;
    }
  }

  async cancelAuctionNotification(vehicleId: string): Promise<void> {
    try {
      const notificationId = `auction_${vehicleId}`;
      await NotificationNative2Module.cancelNotification(notificationId);
    } catch (error) {
      console.error('Failed to cancel auction notification:', error);
    }
  }

  async updateVehicleFavoriteStatus(vehicle: Vehicle, isFavorite: boolean): Promise<void> {
    try {
      if (isFavorite) {
        await this.scheduleAuctionNotification(vehicle);
      } else {
        await this.cancelAuctionNotification(vehicle.id);
      }
    } catch (error) {
      console.error('Failed to update vehicle favorite status:', error);
    }
  }

  async scheduleAllFavoriteNotifications(vehicles: Vehicle[]): Promise<void> {
    try {
      const promises = vehicles.map(vehicle => this.scheduleAuctionNotification(vehicle));
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to schedule favorite notifications:', error);
    }
  }

  async sendImmediateNotification(vehicle: Vehicle): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const title = 'Auction Alert!';
      const body = `${vehicle.name} auction is starting now!`;
      const data = {
        vehicleId: vehicle.id,
        type: 'immediate_auction'
      };

      await NotificationNative2Module.sendImmediateNotification(title, body, data);
    } catch (error) {
      console.error('Failed to send immediate notification:', error);
    }
  }

  async sendTestNotification(vehicle: Vehicle): Promise<void> {
    return this.sendImmediateNotification(vehicle);
  }

  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      return await NotificationNative2Module.getScheduledNotifications() || [];
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async getPendingNotifications(): Promise<ScheduledNotification[]> {
    try {
      return await NotificationNative2Module.getPendingNotifications() || [];
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      return [];
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await NotificationNative2Module.cancelAllNotifications();
      await NotificationNative2Module.clearBadge();
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await NotificationNative2Module.setBadgeCount(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    try {
      await NotificationNative2Module.clearBadge();
    } catch (error) {
      console.error('Failed to clear badge:', error);
    }
  }

  getNotificationStats() {
    // Return stats about the notification service
    return {
      isNative: true,
      isInitialized: this.isInitialized,
      platform: 'native',
      capabilities: {
        scheduling: true,
        backgroundTasks: true,
        pushNotifications: true,
        badgeCount: true,
        soundCustomization: true,
        channelManagement: true,
      }
    };
  }

  cleanup(): void {
    this.isInitialized = false;
  }

  // Event listeners for native module events
  addNotificationReceivedListener(listener: (notification: any) => void) {
    return NotificationNative2Module.addListener('onNotificationReceived', listener);
  }

  addNotificationTappedListener(listener: (notification: any) => void) {
    return NotificationNative2Module.addListener('onNotificationTapped', listener);
  }
}

export default new NativeNotificationService();
