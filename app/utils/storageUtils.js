import AsyncStorage from '@react-native-async-storage/async-storage';

// Get item from AsyncStorage with JSON parsing
export const getStorageItem = async (key, defaultValue = null) => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    if (__DEV__) {
      console.error(`Failed to get storage item ${key}:`, error);
    }
    return defaultValue;
  }
};

// Set item to AsyncStorage with JSON stringifying
export const setStorageItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error(`Failed to set storage item ${key}:`, error);
    }
    return false;
  }
};

// Remove item from AsyncStorage
export const removeStorageItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.error(`Failed to remove storage item ${key}:`, error);
    }
    return false;
  }
};
