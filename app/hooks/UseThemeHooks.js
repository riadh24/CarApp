import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../constants/theme';

const useTheme = () => {
  const isDark = useSelector(state => state.profile.isDarkTheme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch({ type: 'profile/toggleTheme' });
  };

  const theme = {
    isDark,
    colors: {
      // Background colors
      background: isDark ? COLORS.black : COLORS.white,
      surface: isDark ? COLORS.darkgray : COLORS.white2,
      card: isDark ? COLORS.darkgray : COLORS.white,
      
      // Text colors
      text: isDark ? COLORS.white : COLORS.black,
      textSecondary: isDark ? COLORS.lightGray : COLORS.gray,
      textDisabled: isDark ? COLORS.lightGray2 : COLORS.lightGray2,
      
      // Primary colors
      primary: COLORS.blue,
      primaryVariant: COLORS.darkBlue,
      
      // Status colors
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      
      // Border colors
      border: isDark ? COLORS.darkgray : COLORS.lightGray,
      divider: isDark ? COLORS.transparentGray : COLORS.lightGray,
      
      // Other colors
      accent: COLORS.blue,
      notification: COLORS.blue,
      
      // Transparent overlays
      overlay: isDark ? COLORS.transparentBlack7 : COLORS.transparentBlack3,
      backdrop: isDark ? COLORS.transparentBlack9 : COLORS.transparentBlack5,
    },
  };

  return {
    theme,
    isDark,
    toggleTheme,
  };
};

export default useTheme;
