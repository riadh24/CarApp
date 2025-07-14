import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Header } from '../components/ui';
import { getThemeColors } from '../constants/theme';
import { useAuctionNotifications } from '../hooks/useAuctionNotifications';

const NotificationSettingsScreen = ({ navigation }) => {
  const [notificationStats, setNotificationStats] = useState({ total: 0, upcoming: 0, expired: 0 });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  
  const theme = useSelector(state => state.profile.isDarkTheme);
  const vehicles = useSelector(state => state.vehicles.allVehicles);
  const favoriteVehicles = vehicles.filter(v => v.favourite);
  
  const {
    getNotificationStats,
    sendTestNotification,
    clearAllNotifications,
    initializeNotifications,
  } = useAuctionNotifications();

  const colors = getThemeColors(theme);
  const styles = createStyles(colors);

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  const updateStats = useCallback(() => {
    const stats = getNotificationStats();
    setNotificationStats(stats);
  }, [getNotificationStats]);

  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    
    if (value) {
      try {
        await initializeNotifications();
        Alert.alert('Notifications Enabled', 'Auction notifications have been enabled.');
      } catch (_error) {
        Alert.alert('Error', 'Failed to enable notifications. Please check your permissions.');
        setNotificationsEnabled(false);
      }
    } else {
      await clearAllNotifications();
      Alert.alert('Notifications Disabled', 'All auction notifications have been disabled.');
    }
    
    updateStats();
  };

  const handleSendTestNotification = async () => {
    if (favoriteVehicles.length === 0) {
      Alert.alert('No Favorites', 'Please add some vehicles to favorites first.');
      return;
    }

    const testVehicle = favoriteVehicles[0];
    await sendTestNotification(testVehicle);
    setTestNotificationSent(true);
    
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const handleClearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all scheduled auction notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllNotifications();
            updateStats();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notification Settings"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auction Notifications</Text>
          
          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Get notified when your favorite car auctions end
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={notificationsEnabled ? 'white' : colors.textSecondary}
            />
          </View>
        </View>


        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            style={[styles.button, testNotificationSent && styles.successButton]}
            onPress={handleSendTestNotification}
            disabled={!notificationsEnabled || favoriteVehicles.length === 0}
          >
            <Ionicons 
              name={testNotificationSent ? "checkmark" : "notifications-outline"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {testNotificationSent ? 'Test Sent!' : 'Send Test Notification'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={updateStats}
          >
            <Ionicons name="refresh-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Refresh Statistics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearAllNotifications}
            disabled={notificationStats.total === 0}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Clear All Notifications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  warningButton: {
    backgroundColor: colors.warning,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  favoriteVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehicleText: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  auctionDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    padding: 20,
  },
});

export default NotificationSettingsScreen;
