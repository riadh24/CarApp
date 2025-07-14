import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Icon Button Component
 * Single Responsibility: Render icon-only buttons
 */
const IconButton = ({
  icon,
  onPress,
  size = 24,
  color,
  backgroundColor,
  style,
  disabled = false,
  ...props
}) => {
  const { theme } = useTheme();
  
  const defaultColor = color || theme.colors.text;
  const defaultBackgroundColor = backgroundColor || 'transparent';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: defaultBackgroundColor },
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons name={icon} size={size} color={defaultColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;
