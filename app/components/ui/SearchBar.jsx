import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

/**
 * Reusable Search Bar Component
 * Single Responsibility: Handle search input with consistent styling
 */
const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  iconSize = 20,
  showIcon = true,
  autoFocus = false,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }, style]}>
      {showIcon && (
        <Ionicons
          name="search"
          size={iconSize}
          color={theme.colors.textSecondary}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text },
          !showIcon && styles.inputWithoutIcon
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eee',
    margin: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0, // Remove default padding
  },
  inputWithoutIcon: {
    marginLeft: 0,
  },
});

export default SearchBar;
