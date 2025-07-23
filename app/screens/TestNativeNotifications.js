import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SmartNotificationService from '../services/SmartNotificationService';
import { clearPersistedData } from '../Store';

const TestNativeNotifications = () => {
  const [serviceInfo, setServiceInfo] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      const info = SmartNotificationService.getServiceInfo();
      setServiceInfo(info);
      await SmartNotificationService.initialize();
      
      if (info.serviceType === 'native' && SmartNotificationService.service) {
        try {
          const status = await SmartNotificationService.service.getPermissionStatus();
          setPermissionStatus(status);
        } catch (error) {
          console.warn('Native permission check failed:', error);
          setPermissionStatus('unavailable');
        }
      } else {
        setPermissionStatus('using-expo');
      }
    } catch (error) {
      console.error('Failed to initialize service:', error);
      setPermissionStatus('error');
    }
  };

  const testNotification = async () => {
    try {
      const testVehicle = {
        id: 'test-001',
        name: 'BMW X5',
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        auctionDate: '2025-07-16',
        auctionTime: '14:00',
        price: 45000,
        image: 'bmw_1.jpeg'
      };

      await SmartNotificationService.sendTestNotification(testVehicle);
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', `Failed to send notification: ${error.message}`);
    }
  };

  const requestPermissions = async () => {
    try {
      if (serviceInfo?.serviceType === 'native' && SmartNotificationService.service) {
        const status = await SmartNotificationService.service.requestPermissions();
        setPermissionStatus(status);
        Alert.alert('Success', `Permissions ${status}`);
      } else {
        Alert.alert('Info', `Using ${serviceInfo?.serviceType || 'expo'} notification system`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to request permissions: ${error.message}`);
    }
  };

  const clearReduxData = async () => {
    try {
      await clearPersistedData();
      Alert.alert('Success', 'Redux data cleared! Please reload the app.');
    } catch (error) {
      Alert.alert('Error', `Failed to clear data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native Notification Test</Text>
      
      {serviceInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Service Type: {serviceInfo.serviceType}</Text>
          <Text style={styles.infoText}>Service Name: {serviceInfo.serviceName}</Text>
          <Text style={styles.infoText}>Is Expo Go: {serviceInfo.isExpoGo ? 'Yes' : 'No'}</Text>
          <Text style={styles.infoText}>Native Capabilities: {serviceInfo.features.nativeCapabilities ? 'Yes' : 'No'}</Text>
          <Text style={styles.infoText}>Badge Count: {serviceInfo.features.badgeCount ? 'Supported' : 'Not Supported'}</Text>
          <Text style={styles.infoText}>Permission Status: {permissionStatus}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Text style={styles.buttonText}>Request Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testNotification}>
        <Text style={styles.buttonText}>Send Test Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF6B6B' }]} onPress={clearReduxData}>
        <Text style={styles.buttonText}>Clear Redux Data (Dev)</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        {serviceInfo?.serviceType === 'native' ? 
          'Native module active! Advanced features available.' :
          `Current mode: ${serviceInfo?.serviceType || 'loading'}\n\n` +
          'For native module:\n' +
          '• Install: npx expo install expo-dev-client\n' +
          '• Build: npx expo run:android\n' +
          '• Build: npx expo run:ios\n\n' +
          'Native features unavailable in Expo Go.'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    lineHeight: 18,
  },
});

export default TestNativeNotifications;
