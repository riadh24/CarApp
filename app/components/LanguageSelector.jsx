import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { getThemeColors } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSelector = () => {
  const { changeLanguage, currentLanguage } = useTranslation();
  const theme = useSelector(state => state.profile.isDarkTheme);
  const colors = getThemeColors(theme);
  const styles = createStyles(colors);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
  };

  const getLanguageLabel = () => {
    return currentLanguage === 'en' ? 'English' : 'Français';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
      <Ionicons name="language-outline" size={20} color={colors.text} />
      <Text style={styles.text}>{getLanguageLabel()}</Text>
      <Ionicons name="chevron-forward-outline" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 4,
  },
  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
});

export default LanguageSelector;
