import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../Store';
import { createSmartSearchFilter, extractUniqueValues, getSearchSuggestions } from '../utils/searchUtils';

/**
 * Advanced vehicle filtering hook with dynamic search capabilities
 * 
 * This hook provides comprehensive filtering functionality for vehicle data,
 * including smart search that automatically extracts available makes and models
 * from the store data rather than using hardcoded values.
 * 
 * Features:
 * - Dynamic extraction of available makes and models from store
 * - Smart search with exact matching, partial matching, and fuzzy matching
 * - Search suggestions for autocomplete functionality
 * - Support for both API mode and Redux mode
 * - Comprehensive filter management (make, model, price range, favorites)
 * 
 * @param {boolean} apiMode - Whether to use API-based filtering or Redux
 * @returns {Object} Filter state and management functions
 */
export const useVehicleFilters = (apiMode = false) => {
  const dispatch = useDispatch();
  const reduxFilters = useSelector(state => state.vehicles.filters);
  const allVehicles = useSelector(state => state.vehicles.allVehicles);
  
  // Dynamically extract unique makes and models from vehicle data
  const availableMakes = useMemo(() => 
    extractUniqueValues(allVehicles, 'make'), [allVehicles]
  );
  
  const availableModels = useMemo(() => 
    extractUniqueValues(allVehicles, 'model'), [allVehicles]
  );
  
  const [apiFilters, setApiFilters] = useState({
    make: '',
    model: '',
    minBid: 0,
    maxBid: 100000,
    showFavoritesOnly: false,
  });

  const defaultFilters = useMemo(() => ({
    make: '',
    model: '',
    minBid: 0,
    maxBid: 100000,
    showFavoritesOnly: false,
  }), []);

  const currentFilters = apiMode ? apiFilters : reduxFilters;

  const updateFilters = useCallback((newFilters) => {
    if (apiMode) {
      setApiFilters(prev => ({ ...prev, ...newFilters }));
    } else {
      dispatch(setFilters({ ...reduxFilters, ...newFilters }));
    }
  }, [apiMode, dispatch, reduxFilters]);

  const resetFilters = useCallback(() => {
    if (apiMode) {
      setApiFilters(defaultFilters);
    } else {
      dispatch(setFilters(defaultFilters));
    }
  }, [apiMode, dispatch, defaultFilters]);

  const toggleFavorites = useCallback(() => {
    updateFilters({ showFavoritesOnly: !currentFilters.showFavoritesOnly });
  }, [updateFilters, currentFilters.showFavoritesOnly]);

  const toggleMake = useCallback((make) => {
    const newMake = currentFilters.make === make ? '' : make;
    updateFilters({ make: newMake });
  }, [updateFilters, currentFilters.make]);

  const setMake = useCallback((make) => {
    updateFilters({ make });
  }, [updateFilters]);

  const setModel = useCallback((model) => {
    updateFilters({ model });
  }, [updateFilters]);

  const setPriceRange = useCallback((minBid, maxBid) => {
    updateFilters({ minBid, maxBid });
  }, [updateFilters]);

  const filterCount = useMemo(() => {
    let count = 0;
    if (currentFilters.make) count++;
    if (currentFilters.model) count++;
    if (currentFilters.showFavoritesOnly) count++;
    if (currentFilters.minBid > 0) count++;
    if (currentFilters.maxBid < 100000) count++;
    return count;
  }, [currentFilters]);

  const hasActiveFilters = useMemo(() => {
    return filterCount > 0;
  }, [filterCount]);

  const filterSummary = useMemo(() => {
    const summary = [];
    if (currentFilters.make) summary.push(`Make: ${currentFilters.make}`);
    if (currentFilters.model) summary.push(`Model: ${currentFilters.model}`);
    if (currentFilters.showFavoritesOnly) summary.push('Favorites only');
    if (currentFilters.minBid > 0 || currentFilters.maxBid < 100000) {
      summary.push(`Price: $${currentFilters.minBid} - $${currentFilters.maxBid}`);
    }
    return summary;
  }, [currentFilters]);

  const isFilterActive = useCallback((filterType, value) => {
    switch (filterType) {
      case 'make':
        return currentFilters.make === value;
      case 'model':
        return currentFilters.model === value;
      case 'favorites':
        return currentFilters.showFavoritesOnly;
      case 'priceRange':
        return currentFilters.minBid > 0 || currentFilters.maxBid < 100000;
      default:
        return false;
    }
  }, [currentFilters]);

  const getSearchFilter = useCallback((searchText) => {
    return createSmartSearchFilter(searchText, availableMakes, availableModels, allVehicles);
  }, [availableMakes, availableModels, allVehicles]);

  const getSearchSuggestionsForInput = useCallback((input, maxSuggestions = 5) => {
    return getSearchSuggestions(input, availableMakes, availableModels, maxSuggestions);
  }, [availableMakes, availableModels]);

  const applySearchFilter = useCallback((searchText) => {
    const searchFilter = getSearchFilter(searchText);
    updateFilters(searchFilter);
  }, [getSearchFilter, updateFilters]);

  return {
    filters: currentFilters,
    filterCount,
    hasActiveFilters,
    filterSummary,
    updateFilters,
    resetFilters,
    toggleFavorites,
    toggleMake,
    setMake,
    setModel,
    setPriceRange,
    applySearchFilter,
    isFilterActive,
    defaultFilters,
    availableMakes,
    availableModels,
    getSearchSuggestions: getSearchSuggestionsForInput,
  };
};

export default useVehicleFilters;
