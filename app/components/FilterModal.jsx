import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/UseThemeHooks';
import { BaseModal, Button } from './ui';

/**
 * Specialized Filter Modal Component
 * Single Responsibility: Handle vehicle filtering UI
 * Dependency Inversion: Uses BaseModal abstraction
 */
const FilterModal = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  uniqueMakes = [],
  uniqueModels = [],
}) => {
  const { theme } = useTheme();
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      make: '',
      model: '',
      minBid: 0,
      maxBid: 100000,
      showFavoritesOnly: false,
    };
    setTempFilters(resetFilters);
    onResetFilters();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Filters</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        {/* Bid Range */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
          Starting Bid Range
        </Text>
        <View style={styles.bidRangeContainer}>
          <TextInput
            style={[styles.bidInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Min"
            placeholderTextColor={theme.colors.textSecondary}
            value={tempFilters.minBid?.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setTempFilters({
              ...tempFilters,
              minBid: parseInt(text) || 0
            })}
          />
          <Text style={[styles.bidSeparator, { color: theme.colors.textSecondary }]}>
            to
          </Text>
          <TextInput
            style={[styles.bidInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Max"
            placeholderTextColor={theme.colors.textSecondary}
            value={tempFilters.maxBid?.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setTempFilters({
              ...tempFilters,
              maxBid: parseInt(text) || 100000
            })}
          />
        </View>

        {/* Favorites Toggle */}
        <TouchableOpacity
          style={[
            styles.filterOption,
            tempFilters.showFavoritesOnly && { backgroundColor: theme.colors.primary + '10' }
          ]}
          onPress={() => setTempFilters({
            ...tempFilters,
            showFavoritesOnly: !tempFilters.showFavoritesOnly
          })}
        >
          <Text style={[styles.filterOptionText, { color: theme.colors.text }]}>
            Show Favorites Only
          </Text>
          <Ionicons
            name={tempFilters.showFavoritesOnly ? "checkbox" : "checkbox-outline"}
            size={24}
            color={tempFilters.showFavoritesOnly ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Make Filter */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
          Make
        </Text>
        {uniqueMakes.map(make => (
          <TouchableOpacity
            key={make}
            style={[
              styles.filterOption,
              tempFilters.make === make && { backgroundColor: theme.colors.primary + '10' }
            ]}
            onPress={() => setTempFilters({
              ...tempFilters,
              make: tempFilters.make === make ? '' : make
            })}
          >
            <Text style={[styles.filterOptionText, { color: theme.colors.text }]}>
              {make}
            </Text>
            {tempFilters.make === make && (
              <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Reset"
          variant="outline"
          onPress={handleReset}
          style={styles.actionButton}
        />
        <Button
          title="Apply Filters"
          onPress={handleApply}
          style={styles.actionButton}
        />
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  bidRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bidInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  bidSeparator: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default FilterModal;
