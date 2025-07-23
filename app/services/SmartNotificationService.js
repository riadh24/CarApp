import * as Application from 'expo-application';
import AuctionNotificationModule from '../modules/AuctionNotificationModule';
import ExpoGoNotificationService from '../services/ExpoGoNotificationService';

// Try to import native module, fallback if not available
let NativeNotificationService = null;
try {
  const nativeModule = require('../../modules/notification-native');
  NativeNotificationService = nativeModule.NativeNotificationService;
} catch (error) {
  console.warn('Native notification module not available:', error.message);
}

class SmartNotificationService {
  constructor() {
    this.isExpoGo = Application.applicationName === 'Expo Go' || __DEV__;
    this.hasNativeModule = NativeNotificationService !== null;
    
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
