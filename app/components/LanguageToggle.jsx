import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { getThemeColors } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const LanguageToggle = ({ style, size = 20, ...props }) => {
  const { changeLanguage, currentLanguage } = useTranslation();
  const theme = useSelector(state => state.profile.isDarkTheme);
  const colors = getThemeColors(theme);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <TouchableOpacity 
      style={[
        {
          backgroundColor: colors.overlay,
          borderRadius: 20,
          padding: 12,
        },
        style
      ]} 
      onPress={toggleLanguage}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons 
        name="language-outline" 
        size={size} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );
};

export default LanguageToggle;
