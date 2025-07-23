// Device and platform utilities
import * as Application from 'expo-application';
import { Dimensions, Platform } from 'react-native';

// Get device dimensions
export const getDeviceDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const screenData = Dimensions.get('screen');
  
  return {
    window: { width, height },
    screen: screenData,
    isTablet: Math.min(width, height) >= 600,
    isLandscape: width > height,
  };
};

// Platform checks
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// Check if running in Expo Go
export const isExpoGo = () => {
  return Application.applicationName === 'Expo Go' || __DEV__;
};
