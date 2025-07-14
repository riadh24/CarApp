import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Button Component following SOLID principles
 * Single Responsibility: Handle button rendering and user interaction
 * Open/Closed: Extensible through variant prop
 * Interface Segregation: Clean props interface
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, { backgroundColor: theme.colors.primary }, style];
      case 'secondary':
        return [...baseStyle, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.primary }, style];
      case 'outline':
        return [...baseStyle, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary }, style];
      case 'ghost':
        return [...baseStyle, { backgroundColor: 'transparent' }, style];
      case 'danger':
        return [...baseStyle, { backgroundColor: '#ff4444' }, style];
      default:
        return [...baseStyle, { backgroundColor: theme.colors.primary }, style];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
      case 'danger':
        return [...baseTextStyle, { color: '#fff' }, textStyle];
      case 'secondary':
      case 'outline':
        return [...baseTextStyle, { color: theme.colors.primary }, textStyle];
      case 'ghost':
        return [...baseTextStyle, { color: theme.colors.text }, textStyle];
      default:
        return [...baseTextStyle, { color: '#fff' }, textStyle];
    }
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    return (
      <Ionicons 
        name={icon} 
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
        color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.primary}
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabled,
        loading && styles.loading
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.primary} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
      
      {iconPosition === 'right' && renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.8,
  },
});

export default Button;
