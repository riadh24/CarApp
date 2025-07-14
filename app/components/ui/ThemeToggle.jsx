import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Theme Toggle Component
 * Single Responsibility: Toggle between light and dark themes
 */
const ThemeToggle = ({
  style,
  size = 20,
  ...props
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

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
      onPress={toggleTheme}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={size}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};

export default ThemeToggle;
