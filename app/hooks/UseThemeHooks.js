import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const useTheme = () => {
  const { isDarkMode, toggleTheme } = useAuth();

  const theme = {
    isDark: isDarkMode,
    colors: {
      // Background colors
      background: isDarkMode ? COLORS.black : COLORS.white,
      surface: isDarkMode ? COLORS.darkgray : COLORS.white2,
      card: isDarkMode ? COLORS.darkgray : COLORS.white,
      
      // Text colors
      text: isDarkMode ? COLORS.white : COLORS.black,
      textSecondary: isDarkMode ? COLORS.lightGray : COLORS.gray,
      textDisabled: isDarkMode ? COLORS.lightGray2 : COLORS.lightGray2,
      
      // Primary colors
      primary: COLORS.blue,
      primaryVariant: COLORS.darkBlue,
      
      // Status colors
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      
      // Border colors
      border: isDarkMode ? COLORS.darkgray : COLORS.lightGray,
      divider: isDarkMode ? COLORS.transparentGray : COLORS.lightGray,
      
      // Other colors
      accent: COLORS.blue,
      notification: COLORS.blue,
      
      // Transparent overlays
      overlay: isDarkMode ? COLORS.transparentBlack7 : COLORS.transparentBlack3,
      backdrop: isDarkMode ? COLORS.transparentBlack9 : COLORS.transparentBlack5,
    },
  };

  return {
    theme,
    isDark: isDarkMode,
    toggleTheme,
  };
};

export default useTheme;
