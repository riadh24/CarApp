import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Empty State Component
 * Single Responsibility: Display consistent empty states
 */
const EmptyState = ({
  icon,
  title,
  description,
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]} {...props}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      {title && (
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
      )}
      
      {description && (
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      )}
      
      {children && (
        <View style={styles.actionContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionContainer: {
    alignItems: 'center',
  },
});

export default EmptyState;
