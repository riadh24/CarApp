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
import { LanguageToggle } from '../components';
import { Header } from '../components/ui';
import { useAuctionNotifications } from '../hooks/useAuctionNotifications';
import useTheme from '../hooks/UseThemeHooks';
import { useTranslation } from '../hooks/useTranslation';

const NotificationSettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [notificationStats, setNotificationStats] = useState({ total: 0, upcoming: 0, expired: 0 });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  
  const { theme } = useTheme();
  const vehicles = useSelector(state => state.vehicles.allVehicles);
  const favoriteVehicles = vehicles.filter(v => v.favourite);
  
  const {
    getNotificationStats,
    sendTestNotification,
    clearAllNotifications,
    initializeNotifications,
  } = useAuctionNotifications();

  const styles = createStyles(theme.colors);

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
        Alert.alert(
          t('notificationSettings.notificationsEnabled'), 
          t('notificationSettings.notificationsEnabledMessage')
        );
      } catch (_error) {
        Alert.alert(
          t('notificationSettings.error'), 
          t('notificationSettings.errorMessage')
        );
        setNotificationsEnabled(false);
      }
    } else {
      await clearAllNotifications();
      Alert.alert(
        t('notificationSettings.notificationsDisabled'), 
        t('notificationSettings.notificationsDisabledMessage')
      );
    }
    
    updateStats();
  };

  const handleSendTestNotification = async () => {
    if (favoriteVehicles.length === 0) {
      Alert.alert(
        t('notificationSettings.noFavorites'), 
        t('notificationSettings.noFavoritesMessage')
      );
      return;
    }

    const testVehicle = favoriteVehicles[0];
    await sendTestNotification(testVehicle);
    setTestNotificationSent(true);
    
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const handleClearAllNotifications = () => {
    Alert.alert(
      t('notificationSettings.clearAllNotificationsTitle'),
      t('notificationSettings.clearAllNotificationsMessage'),
      [
        { text: t('notificationSettings.cancel'), style: 'cancel' },
        {
          text: t('notificationSettings.clearAll'),
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
        title={t('notificationSettings.title')}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <LanguageToggle />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.auctionNotifications')}</Text>
          
          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{t('notificationSettings.enableNotifications')}</Text>
              <Text style={styles.settingDescription}>
                {t('notificationSettings.enableNotificationsDescription')}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={notificationsEnabled ? 'white' : theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.actions')}</Text>
          
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
              {testNotificationSent ? t('notificationSettings.testSent') : t('notificationSettings.sendTestNotification')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={updateStats}
          >
            <Ionicons name="refresh-outline" size={20} color="white" />
            <Text style={styles.buttonText}>{t('notificationSettings.refreshStatistics')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearAllNotifications}
            disabled={notificationStats.total === 0}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.buttonText}>{t('notificationSettings.clearAllNotifications')}</Text>
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
