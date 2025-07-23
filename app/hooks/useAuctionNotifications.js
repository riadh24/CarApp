import * as Notifications from 'expo-notifications';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SmartNotificationService from '../services/SmartNotificationService';
import { parseVehicleDate } from '../Store';

/**
 * Custom hook for managing auction notifications
 * Integrates with Redux store and handles notification lifecycle
 */
export const useAuctionNotifications = () => {
  const vehicles = useSelector(state => state.vehicles.allVehicles);
  const isAuthenticated = useSelector(state => state.profile.isAuthenticated);

  /**
   * Initialize notification system
   */
  const initializeNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await SmartNotificationService.initialize();
      
      // Schedule notifications for all current favorite vehicles
      await SmartNotificationService.scheduleAllFavoriteNotifications(vehicles);
    } catch (error) {
      console.error('[useAuctionNotifications] Failed to initialize notifications:', error);
      
      Alert.alert(
        'Notification Setup',
        'Unable to set up auction notifications. Please check your notification permissions in device settings.',
        [{ text: 'OK' }]
      );
    }
  }, [isAuthenticated, vehicles]);

  /**
   * Handle vehicle favorite toggle
   */
  const handleFavoriteToggle = useCallback(async (vehicle, isFavorite) => {
    try {
      await SmartNotificationService.updateVehicleFavoriteStatus(vehicle, isFavorite);
      
      if (isFavorite) {
        // Show confirmation for scheduling notification
        const auctionDate = parseVehicleDate(vehicle.auctionDateTime);
        const now = new Date();
        
        if (auctionDate && auctionDate > now) {
          Alert.alert(
            '🔔 Notification Scheduled',
            `You'll be notified when the auction for ${vehicle.make} ${vehicle.model} ends on ${auctionDate.toLocaleDateString()} at ${auctionDate.toLocaleTimeString()}.`,
            [{ text: 'Got it' }]
          );
        }
      }
    } catch (error) {
      console.error('[useAuctionNotifications] Failed to update favorite status:', error);
    }
  }, []);

  /**
   * Send test notification
   */
  const sendTestNotification = useCallback(async (vehicle) => {
    try {
      await SmartNotificationService.sendTestNotification(vehicle);
      
      Alert.alert(
        'Test Notification Sent',
        `A test notification has been sent for ${vehicle.make} ${vehicle.model}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[useAuctionNotifications] Failed to send test notification:', error);
      Alert.alert('Error', 'Failed to send test notification.');
    }
  }, []);

  /**
   * Get notification statistics
   */
  const getNotificationStats = useCallback(() => {
    return SmartNotificationService.getNotificationStats();
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(async () => {
    try {
      await SmartNotificationService.clearAllNotifications();
      Alert.alert('Notifications Cleared', 'All auction notifications have been cleared.');
    } catch (error) {
      console.error('[useAuctionNotifications] Failed to clear notifications:', error);
      Alert.alert('Error', 'Failed to clear notifications.');
    }
  }, []);

  /**
   * Handle notification response (when user taps notification)
   */
  const handleNotificationResponse = useCallback((response) => {
    const data = response.notification.request.content.data;
    
    if (data?.type === 'auction-ended' || data?.type === 'auction-ended-test') {
      // Navigate to car details or show relevant screen
      
      // You can dispatch navigation actions here or return data for the component to handle
      return {
        type: 'navigate-to-vehicle',
        vehicleId: data.vehicleId,
        vehicle: data.vehicle,
      };
    }
  }, []);

  // Set up notification response listener
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    
    return () => subscription.remove();
  }, [handleNotificationResponse]);

  // Initialize notifications when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      initializeNotifications();
    } else {
      // Clear notifications when user logs out
      SmartNotificationService.clearAllNotifications();
    }
  }, [isAuthenticated, initializeNotifications]);

  return {
    initializeNotifications,
    handleFavoriteToggle,
    sendTestNotification,
    getNotificationStats,
    clearAllNotifications,
    handleNotificationResponse,
  };
};
