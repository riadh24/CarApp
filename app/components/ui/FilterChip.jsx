import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Filter Chip Component
 * Single Responsibility: Display interactive filter tags
 */
const FilterChip = ({
  label,
  icon,
  active = false,
  onPress,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.primary : theme.colors.surface,
          borderColor: active ? theme.colors.primary : '#eee',
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={active ? '#fff' : theme.colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: active ? '#fff' : theme.colors.textSecondary }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FilterChip;
