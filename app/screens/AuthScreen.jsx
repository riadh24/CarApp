import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Button, LanguageToggle, ThemeToggle } from '../components';
import { useAuth } from '../contexts/AuthContext';
import useTheme from '../hooks/UseThemeHooks';
import { useTranslation } from '../hooks/useTranslation';

const AuthScreen = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?w=1380');
  const [emailError, setEmailError] = useState('');
  const { theme, isDark } = useTheme();
  const { login } = useAuth();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('auth.permissionDenied'), t('auth.galleryPermission'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const validateEmail = (value) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError(t('auth.emailInvalid'));
      return;
    }
    setEmailError('');
    
    const result = await login({ email: email.trim(), avatar });
    if (!result.success) {
      Alert.alert(t('auth.loginError'), result.error || t('auth.loginFailed'));
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a1a', '#2d2d2d', '#1a1a1a'] : ['#f8f9fa', '#ffffff', '#f8f9fa']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ThemeToggle style={styles.themeToggle} />
      <LanguageToggle style={styles.languageToggle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>{t('auth.welcome')}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('auth.enterDetails')}
          </Text>
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.7} style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={[styles.avatarOverlay, { backgroundColor: theme.colors.overlay }]}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.changePhoto, { color: theme.colors.primary }]}>{t('auth.changePhoto')}</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label={t('auth.emailAddress')}
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            error={!!emailError}
            theme={{
              colors: {
                primary: theme.colors.primary,
                outline: theme.colors.border,
                onSurface: theme.colors.text,
                background: theme.colors.surface,
              }
            }}
          />
          {emailError ? <Text style={[styles.error, { color: theme.colors.error }]}>{emailError}</Text> : null}
        </View>

        <Button 
          title={t('auth.continue')}
          onPress={handleLogin}
          variant="primary"
          size="large"
          style={styles.button}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  languageToggle: {
    position: 'absolute',
    top: 50,
    right: 80,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhoto: { 
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 32,
  },
  input: { 
    marginBottom: 8,
    fontSize: 16,
  },
  error: { 
    marginBottom: 8, 
    marginLeft: 4, 
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
});

export default AuthScreen;