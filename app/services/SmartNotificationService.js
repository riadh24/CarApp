import * as Application from 'expo-application';
import AuctionNotificationModule from '../modules/AuctionNotificationModule';
import ExpoGoNotificationService from '../services/ExpoGoNotificationService';

/**
 * Smart notification service that automatically chooses the appropriate
 * notification implementation based on the runtime environment
 */
class SmartNotificationService {
  constructor() {
    this.isExpoGo = Application.applicationName === 'Expo Go' || __DEV__;
    this.service = this.isExpoGo ? ExpoGoNotificationService : AuctionNotificationModule;
  }

  // Proxy all methods to the appropriate service
  async initialize() {
    return this.service.initialize();
  }

  async scheduleAuctionNotification(vehicle) {
    return this.service.scheduleAuctionNotification(vehicle);
  }

  async cancelAuctionNotification(vehicleId) {
    return this.service.cancelAuctionNotification(vehicleId);
  }

  async updateVehicleFavoriteStatus(vehicle, isFavorite) {
    return this.service.updateVehicleFavoriteStatus(vehicle, isFavorite);
  }

  async scheduleAllFavoriteNotifications(vehicles) {
    return this.service.scheduleAllFavoriteNotifications(vehicles);
  }

  async sendTestNotification(vehicle) {
    // Use the appropriate method name based on service type
    if (this.isExpoGo) {
      return this.service.sendTestNotification(vehicle);
    } else {
      return this.service.sendImmediateNotification(vehicle);
    }
  }

  getScheduledNotifications() {
    return this.service.getScheduledNotifications();
  }

  getNotificationStats() {
    return this.service.getNotificationStats();
  }

  async clearAllNotifications() {
    return this.service.clearAllNotifications();
  }

  cleanup() {
    return this.service.cleanup();
  }

  // Additional method to get service info
  getServiceInfo() {
    return {
      isExpoGo: this.isExpoGo,
      serviceName: this.isExpoGo ? 'ExpoGoNotificationService' : 'AuctionNotificationModule',
      features: {
        backgroundTasks: !this.isExpoGo,
        pushNotifications: !this.isExpoGo,
        localNotifications: true,
        appStateMonitoring: true,
      }
    };
  }
}

export default new SmartNotificationService();
