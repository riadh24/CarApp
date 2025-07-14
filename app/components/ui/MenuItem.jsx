import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Menu Item Component
 * Single Responsibility: Render menu items consistently
 */
const MenuItem = ({
  icon,
  label,
  onPress,
  style,
  textColor,
  iconColor,
  variant = 'default',
  ...props
}) => {
  const { theme } = useTheme();
  
  const getTextColor = () => {
    if (textColor) return textColor;
    if (variant === 'danger') return theme.colors.error;
    return theme.colors.text;
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (variant === 'danger') return theme.colors.error;
    return theme.colors.text;
  };

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        variant === 'logout' && [styles.logoutItem, { borderTopColor: theme.colors.border }],
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons name={icon} size={24} color={getIconColor()} />
      <Text style={[styles.menuText, { color: getTextColor() }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutItem: {
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 20,
  },
});

export default MenuItem;
