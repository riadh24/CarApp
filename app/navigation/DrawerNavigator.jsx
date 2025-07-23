import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MenuItem } from '../components';
import { useAuth } from '../contexts/AuthContext';
import useTheme from '../hooks/UseThemeHooks';
import { useTranslation } from '../hooks/useTranslation';
import MainStack from './MainStack';

const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { user, logout, setHasSeenLanding } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLogout = async () => {
    await logout();
    await setHasSeenLanding(false); // Reset to show landing screen
    navigation.closeDrawer();
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
  };

  const getLanguageLabel = () => {
    return currentLanguage === 'en' ? 'Français' : 'English';
  };

  const styles = getDrawerStyles(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: theme.colors.primaryVariant }]}>
        <Image
          source={{ uri: user?.avatar || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?w=1380' }}
          style={styles.avatar}
        />
        <Text style={[styles.email, { color: '#ffffff' }]}>{user?.email || t('auth.notLoggedIn')}</Text>
      </View>

      <View style={styles.menuSection}>
        <MenuItem
          icon="home-outline"
          label={t('navigation.home')}
          onPress={() => {
            navigation.navigate('MainStack', { screen: 'Home' });
            navigation.closeDrawer();
          }}
        />

        <MenuItem
          icon="notifications-outline"
          label={t('navigation.notifications')}
          onPress={() => {
            navigation.navigate('MainStack', { screen: 'NotificationSettings' });
            navigation.closeDrawer();
          }}
        />

        <MenuItem
          icon="settings-outline"
          label={t('navigation.settings')}
          onPress={() => {
            navigation.closeDrawer();
          }}
        />

        <MenuItem
          icon="language-outline"
          label={getLanguageLabel()}
          onPress={handleLanguageToggle}
        />

        <MenuItem
          icon={isDark ? 'sunny-outline' : 'moon-outline'}
          label={isDark ? t('navigation.lightMode') : t('navigation.darkMode')}
          onPress={toggleTheme}
        />
      </View>

      {/* Logout */}
      <MenuItem
        icon="log-out-outline"
        label={t('navigation.logout')}
        onPress={handleLogout}
        variant="logout"
        textColor={theme.colors.error}
        iconColor={theme.colors.error}
      />
    </View>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
  );
};

const getDrawerStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
});

export default DrawerNavigator;
