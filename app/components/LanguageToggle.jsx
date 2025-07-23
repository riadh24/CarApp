import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import useTheme from '../hooks/UseThemeHooks';
import { useTranslation } from '../hooks/useTranslation';

const LanguageToggle = ({ style, size = 20, ...props }) => {
  const { changeLanguage, currentLanguage } = useTranslation();
  const { theme } = useTheme();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <TouchableOpacity 
      style={[
        {
          backgroundColor: theme.colors.overlay,
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
        color={theme.colors.text} 
      />
    </TouchableOpacity>
  );
};

export default LanguageToggle;
