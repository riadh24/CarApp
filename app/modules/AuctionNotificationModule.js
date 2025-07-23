import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { parseVehicleDate } from '../utils';

const BACKGROUND_AUCTION_CHECK = 'background-auction-check';
const AUCTION_NOTIFICATIONS_KEY = 'auction_notifications_scheduled';

const isExpoGo = () => {
  return Application.applicationName === 'Expo Go' || 
         __DEV__ && Platform.OS === 'web';
};

class AuctionNotificationModule {
  constructor() {
    this.isInitialized = false;
    this.scheduledNotifications = new Map();
    this.fallbackTimer = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      await this.requestPermissions();
      await this.setupNotificationCategories();

      // Register background task only if not in Expo Go
      if (!isExpoGo()) {
        await this.registerBackgroundTask();
      } else {
        this.setupFallbackTimer();
      }

      // Load scheduled notifications from storage
      await this.loadScheduledNotifications();

      this.isInitialized = true;
    } catch (error) {
      console.error('[AuctionNotificationModule] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Request notification permissions from the user
   */
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Failed to get push token for push notification!');
    }

    // For Android, configure notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('auction-alerts', {
        name: 'Car Auction Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        description: 'Notifications for favorite car auction endings',
      });
    }

    return finalStatus;
  }

  /**
   * Set up notification categories with actions
   */
  async setupNotificationCategories() {
    await Notifications.setNotificationCategoryAsync('auction-ended', [
      {
        identifier: 'view-auction',
        buttonTitle: 'View Details',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Dismiss',
        options: {
          isDestructive: false,
        },
      },
    ]);
  }

  /**
   * Register background task for checking auction statuses
   */
  async registerBackgroundTask() {
    try {
      // Define the background task
      TaskManager.defineTask(BACKGROUND_AUCTION_CHECK, async () => {
        try {
          await this.checkAuctionStatuses();
          return { success: true };
        } catch (error) {
          console.error('[BackgroundTask] Error checking auctions:', error);
          return { success: false };
        }
      });

      // Check if task is already registered
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_AUCTION_CHECK);
    } catch (_error) {
      this.setupFallbackTimer();
    }
  }

  /**
   * Setup fallback timer for Expo Go and when background tasks aren't available
   */
  setupFallbackTimer() {
    // Use a regular timer as fallback (only works when app is in foreground)
    this.fallbackTimer = setInterval(async () => {
      try {
        await this.checkAuctionStatuses();
      } catch (error) {
        console.error('[FallbackTimer] Error checking auctions:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes when app is active
  }

  /**
   * Schedule notification for a favorite car auction
   * @param {Object} vehicle - Vehicle object with auction details
   */
  async scheduleAuctionNotification(vehicle) {
    if (!vehicle.favourite) return;

    const notificationId = `auction-${vehicle.id}`;
    const auctionEndTime = parseVehicleDate(vehicle.auctionDateTime);
    
    // Check if auction has already ended or date is invalid
    if (!auctionEndTime || auctionEndTime <= new Date()) {
      console.log(`[AuctionNotificationModule] Auction for ${vehicle.make} ${vehicle.model} has already ended or invalid date`);
      return;
    }

    try {
      // Cancel existing notification if any
      await this.cancelAuctionNotification(vehicle.id);

      // Schedule the notification
      const scheduledNotificationId = await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title: '🏁 Auction Ended!',
          body: `The auction for your favorite ${vehicle.make} ${vehicle.model} (${vehicle.year}) has ended. Starting bid was $${vehicle.startingBid.toLocaleString()}.`,
          data: {
            vehicleId: vehicle.id,
            type: 'auction-ended',
            vehicle: vehicle,
          },
          categoryIdentifier: 'auction-ended',
          sound: 'default',
        },
        trigger: {
          date: auctionEndTime,
        },
      });

      // Store in local map and persistent storage
      this.scheduledNotifications.set(vehicle.id, {
        notificationId: scheduledNotificationId,
        vehicleId: vehicle.id,
        auctionEndTime: auctionEndTime,
        vehicle: vehicle,
      });

      await this.saveScheduledNotifications();

      console.log(`[AuctionNotificationModule] Scheduled notification for ${vehicle.make} ${vehicle.model} at ${auctionEndTime}`);
    } catch (error) {
      console.error(`[AuctionNotificationModule] Failed to schedule notification for vehicle ${vehicle.id}:`, error);
    }
  }

  /**
   * Cancel notification for a specific vehicle
   * @param {number} vehicleId - ID of the vehicle
   */
  async cancelAuctionNotification(vehicleId) {
    const scheduledNotification = this.scheduledNotifications.get(vehicleId);
    
    if (scheduledNotification) {
      try {
        await Notifications.cancelScheduledNotificationAsync(scheduledNotification.notificationId);
        this.scheduledNotifications.delete(vehicleId);
        await this.saveScheduledNotifications();
        
        console.log(`[AuctionNotificationModule] Cancelled notification for vehicle ${vehicleId}`);
      } catch (error) {
        console.error(`[AuctionNotificationModule] Failed to cancel notification for vehicle ${vehicleId}:`, error);
      }
    }
  }

  /**
   * Update notifications when vehicle favorite status changes
   * @param {Object} vehicle - Vehicle object
   * @param {boolean} isFavorite - New favorite status
   */
  async updateVehicleFavoriteStatus(vehicle, isFavorite) {
    if (isFavorite) {
      await this.scheduleAuctionNotification(vehicle);
    } else {
      await this.cancelAuctionNotification(vehicle.id);
    }
  }

  /**
   * Batch schedule notifications for all favorite vehicles
   * @param {Array} vehicles - Array of vehicle objects
   */
  async scheduleAllFavoriteNotifications(vehicles) {
    const favoriteVehicles = vehicles.filter(v => v.favourite);
    
    console.log(`[AuctionNotificationModule] Scheduling notifications for ${favoriteVehicles.length} favorite vehicles`);
    
    for (const vehicle of favoriteVehicles) {
      await this.scheduleAuctionNotification(vehicle);
    }
  }

  /**
   * Background task to check auction statuses
   */
  async checkAuctionStatuses() {
    try {
      const now = new Date();
      const endedAuctions = [];

      // Check all scheduled notifications
      for (const [, notification] of this.scheduledNotifications) {
        if (notification.auctionEndTime <= now) {
          endedAuctions.push(notification);
        }
      }

      // Clean up ended auctions
      for (const endedAuction of endedAuctions) {
        this.scheduledNotifications.delete(endedAuction.vehicleId);
      }

      if (endedAuctions.length > 0) {
        await this.saveScheduledNotifications();
        console.log(`[AuctionNotificationModule] Cleaned up ${endedAuctions.length} ended auctions`);
      }
    } catch (error) {
      console.error('[AuctionNotificationModule] Error in background check:', error);
    }
  }

  /**
   * Get all currently scheduled notifications
   */
  getScheduledNotifications() {
    return Array.from(this.scheduledNotifications.values());
  }

  /**
   * Save scheduled notifications to persistent storage
   */
  async saveScheduledNotifications() {
    try {
      const notificationsArray = Array.from(this.scheduledNotifications.entries());
      await AsyncStorage.setItem(AUCTION_NOTIFICATIONS_KEY, JSON.stringify(notificationsArray));
    } catch (error) {
      console.error('[AuctionNotificationModule] Failed to save scheduled notifications:', error);
    }
  }

  /**
   * Load scheduled notifications from persistent storage
   */
  async loadScheduledNotifications() {
    try {
      const storedNotifications = await AsyncStorage.getItem(AUCTION_NOTIFICATIONS_KEY);
      if (storedNotifications) {
        const notificationsArray = JSON.parse(storedNotifications);
        this.scheduledNotifications = new Map(notificationsArray);
        
        // Clean up any expired notifications
        await this.checkAuctionStatuses();
      }
    } catch (error) {
      console.error('[AuctionNotificationModule] Failed to load scheduled notifications:', error);
    }
  }

  /**
   * Send immediate notification (for testing purposes)
   * @param {Object} vehicle - Vehicle object
   */
  async sendImmediateNotification(vehicle) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏁 Auction Ended! (Test)',
          body: `Test notification: The auction for your favorite ${vehicle.make} ${vehicle.model} (${vehicle.year}) has ended.`,
          data: {
            vehicleId: vehicle.id,
            type: 'auction-ended-test',
            vehicle: vehicle,
          },
          categoryIdentifier: 'auction-ended',
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      console.log(`[AuctionNotificationModule] Sent immediate test notification for ${vehicle.make} ${vehicle.model}`);
    } catch (error) {
      console.error('[AuctionNotificationModule] Failed to send immediate notification:', error);
    }
  }

  /**
   * Clear all scheduled notifications
   */
  async clearAllNotifications() {
    try {
      // Cancel all scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Clear local storage
      this.scheduledNotifications.clear();
      await AsyncStorage.removeItem(AUCTION_NOTIFICATIONS_KEY);
      
      // Clear fallback timer if running
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      
      console.log('[AuctionNotificationModule] Cleared all notifications');
    } catch (error) {
      console.error('[AuctionNotificationModule] Failed to clear notifications:', error);
    }
  }

  /**
   * Cleanup resources (call on app unmount or logout)
   */
  cleanup() {
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    this.isInitialized = false;
  }

  /**
   * Get notification statistics
   */
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
}

// Export singleton instance
export default new AuctionNotificationModule();
