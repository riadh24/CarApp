import * as Application from 'expo-application';
import { NativeNotificationService } from '../../modules/notification-native';
import AuctionNotificationModule from '../modules/AuctionNotificationModule';
import ExpoGoNotificationService from '../services/ExpoGoNotificationService';

/**
 * Smart notification service that automatically chooses the appropriate
 * notification implementation based on the runtime environment
 */
class SmartNotificationService {
  constructor() {
    this.isExpoGo = Application.applicationName === 'Expo Go' || __DEV__;
    this.hasNativeModule = true; // We now have a native module available
    
    // Priority: Native > Expo Notifications > ExpoGo fallback
    if (!this.isExpoGo && this.hasNativeModule) {
      this.service = NativeNotificationService;
      this.serviceType = 'native';
    } else if (this.isExpoGo) {
      this.service = ExpoGoNotificationService;
      this.serviceType = 'expo-go';
    } else {
      this.service = AuctionNotificationModule;
      this.serviceType = 'expo-notifications';
    }
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
    if (this.serviceType === 'expo-go') {
      return this.service.sendTestNotification(vehicle);
    } else if (this.serviceType === 'native') {
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
      serviceType: this.serviceType,
      serviceName: this.serviceType === 'native' ? 'NativeNotificationService' : 
                   this.serviceType === 'expo-go' ? 'ExpoGoNotificationService' : 'AuctionNotificationModule',
      features: {
        backgroundTasks: this.serviceType === 'native' || this.serviceType === 'expo-notifications',
        pushNotifications: this.serviceType === 'native' || this.serviceType === 'expo-notifications',
        localNotifications: true,
        appStateMonitoring: true,
        nativeCapabilities: this.serviceType === 'native',
        badgeCount: this.serviceType === 'native',
        soundCustomization: this.serviceType === 'native',
      }
    };
  }
}

export default new SmartNotificationService();
