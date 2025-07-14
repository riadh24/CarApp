import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';

const EXPO_GO_NOTIFICATIONS_KEY = 'expo_go_notifications';

/**
 * Expo Go compatible notification service
 * Provides basic notification functionality that works in Expo Go
 * with fallbacks for missing features
 */
class ExpoGoNotificationService {
  constructor() {
    this.isExpoGo = Application.applicationName === 'Expo Go' || __DEV__;
    this.scheduledNotifications = new Map();
    this.appStateListener = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false, // Badge not supported in Expo Go
        }),
      });

      // Request permissions
      await this.requestPermissions();

      // Set up app state monitoring for foreground checks
      this.setupAppStateMonitoring();

      // Load saved notifications
      await this.loadScheduledNotifications();

      this.isInitialized = true;
      console.log('[ExpoGoNotificationService] Initialized for Expo Go compatibility');
    } catch (error) {
      console.error('[ExpoGoNotificationService] Initialization failed:', error);
      throw error;
    }
  }

  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[ExpoGoNotificationService] Notification permissions not granted');
      return false;
    }

    return true;
  }

  setupAppStateMonitoring() {
    // Monitor app state changes to check for expired auctions
    this.appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        this.checkExpiredAuctions();
      }
    });
  }

  async scheduleAuctionNotification(vehicle) {
    if (!vehicle.favourite) return;

    const auctionEndTime = new Date(vehicle.auctionDateTime);
    const now = new Date();

    // Check if auction has already ended
    if (auctionEndTime <= now) {
      console.log(`[ExpoGoNotificationService] Auction for ${vehicle.make} ${vehicle.model} has already ended`);
      return;
    }

    try {
      // Cancel existing notification
      await this.cancelAuctionNotification(vehicle.id);

      // In Expo Go, we can only schedule local notifications
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏁 Auction Ending Soon!',
          body: `Your favorite ${vehicle.make} ${vehicle.model} (${vehicle.year}) auction is ending soon!`,
          data: {
            vehicleId: vehicle.id,
            type: 'auction-reminder',
            vehicle: vehicle,
          },
        },
        trigger: {
          date: auctionEndTime,
        },
      });

      // Store notification info
      this.scheduledNotifications.set(vehicle.id, {
        notificationId,
        vehicleId: vehicle.id,
        auctionEndTime,
        vehicle,
      });

      await this.saveScheduledNotifications();

      console.log(`[ExpoGoNotificationService] Scheduled notification for ${vehicle.make} ${vehicle.model}`);
    } catch (error) {
      console.error(`[ExpoGoNotificationService] Failed to schedule notification:`, error);
    }
  }

  async cancelAuctionNotification(vehicleId) {
    const notification = this.scheduledNotifications.get(vehicleId);
    
    if (notification) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
        this.scheduledNotifications.delete(vehicleId);
        await this.saveScheduledNotifications();
        
        console.log(`[ExpoGoNotificationService] Cancelled notification for vehicle ${vehicleId}`);
      } catch (error) {
        console.error(`[ExpoGoNotificationService] Failed to cancel notification:`, error);
      }
    }
  }

  async updateVehicleFavoriteStatus(vehicle, isFavorite) {
    if (isFavorite) {
      await this.scheduleAuctionNotification(vehicle);
    } else {
      await this.cancelAuctionNotification(vehicle.id);
    }
  }

  async scheduleAllFavoriteNotifications(vehicles) {
    const favoriteVehicles = vehicles.filter(v => v.favourite);
    
    console.log(`[ExpoGoNotificationService] Scheduling ${favoriteVehicles.length} notifications`);
    
    for (const vehicle of favoriteVehicles) {
      await this.scheduleAuctionNotification(vehicle);
    }
  }

  async checkExpiredAuctions() {
    try {
      const now = new Date();
      const expiredNotifications = [];

      for (const [, notification] of this.scheduledNotifications) {
        if (notification.auctionEndTime <= now) {
          expiredNotifications.push(notification);
          
          // Send immediate notification for ended auction
          await this.sendAuctionEndedNotification(notification.vehicle);
        }
      }

      // Clean up expired notifications
      for (const notification of expiredNotifications) {
        this.scheduledNotifications.delete(notification.vehicleId);
      }

      if (expiredNotifications.length > 0) {
        await this.saveScheduledNotifications();
        console.log(`[ExpoGoNotificationService] Processed ${expiredNotifications.length} expired auctions`);
      }
    } catch (error) {
      console.error('[ExpoGoNotificationService] Error checking expired auctions:', error);
    }
  }

  async sendAuctionEndedNotification(vehicle) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏁 Auction Ended!',
          body: `The auction for your favorite ${vehicle.make} ${vehicle.model} has ended. Check the results!`,
          data: {
            vehicleId: vehicle.id,
            type: 'auction-ended',
            vehicle: vehicle,
          },
        },
        trigger: null, // Send immediately
      });

      console.log(`[ExpoGoNotificationService] Sent auction ended notification for ${vehicle.make} ${vehicle.model}`);
    } catch (error) {
      console.error('[ExpoGoNotificationService] Failed to send auction ended notification:', error);
    }
  }

  async sendTestNotification(vehicle) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Test Notification',
          body: `This is a test notification for ${vehicle.make} ${vehicle.model}. Notifications are working!`,
          data: {
            vehicleId: vehicle.id,
            type: 'test',
            vehicle: vehicle,
          },
        },
        trigger: null,
      });

      console.log(`[ExpoGoNotificationService] Sent test notification`);
    } catch (error) {
      console.error('[ExpoGoNotificationService] Failed to send test notification:', error);
    }
  }

  getScheduledNotifications() {
    return Array.from(this.scheduledNotifications.values());
  }

  getNotificationStats() {
    const total = this.scheduledNotifications.size;
    const now = new Date();
    const upcoming = Array.from(this.scheduledNotifications.values())
      .filter(n => n.auctionEndTime > now).length;
    
    return {
      total,
      upcoming,
      expired: total - upcoming,
    };
  }

  async clearAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.scheduledNotifications.clear();
      await AsyncStorage.removeItem(EXPO_GO_NOTIFICATIONS_KEY);
      
      console.log('[ExpoGoNotificationService] Cleared all notifications');
    } catch (error) {
      console.error('[ExpoGoNotificationService] Failed to clear notifications:', error);
    }
  }

  async saveScheduledNotifications() {
    try {
      const notificationsArray = Array.from(this.scheduledNotifications.entries());
      await AsyncStorage.setItem(EXPO_GO_NOTIFICATIONS_KEY, JSON.stringify(notificationsArray));
    } catch (error) {
      console.error('[ExpoGoNotificationService] Failed to save notifications:', error);
    }
  }

  async loadScheduledNotifications() {
    try {
      const stored = await AsyncStorage.getItem(EXPO_GO_NOTIFICATIONS_KEY);
      if (stored) {
        const notificationsArray = JSON.parse(stored);
        this.scheduledNotifications = new Map(notificationsArray);
        
        // Check for expired notifications on load
        await this.checkExpiredAuctions();
      }
    } catch (error) {
      console.error('[ExpoGoNotificationService] Failed to load notifications:', error);
    }
  }

  cleanup() {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
    this.isInitialized = false;
  }
}

export default new ExpoGoNotificationService();
