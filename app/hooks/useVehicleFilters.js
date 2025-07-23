import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../Store';

export const useVehicleFilters = (apiMode = false) => {
  const dispatch = useDispatch();
  const reduxFilters = useSelector(state => state.vehicles.filters);
  
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
    const lowerText = searchText.toLowerCase();
    if (lowerText.includes('tesla')) return { make: 'Tesla' };
    if (lowerText.includes('bmw')) return { make: 'BMW' };
    if (lowerText.includes('audi')) return { make: 'Audi' };
    if (lowerText.includes('mercedes')) return { make: 'Mercedes' };
    return { make: '' };
  }, []);

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
  };
};

export default useVehicleFilters;
