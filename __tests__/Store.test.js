// Real CarApp Store Tests
import { configureStore } from '@reduxjs/toolkit';

// Now import the real store components
import vehiclesReducer, {
  defaultFilters,
  resetFilters,
  setFilters,
  toggleFavorite
} from '../app/store/reducers/vehiclesReducer';

// Import Context components for testing
import { AUTH_ACTIONS } from '../app/contexts/AuthContext';

// Mock storage utilities
jest.mock('../app/utils', () => ({
  getStorageItem: jest.fn((key, defaultValue) => Promise.resolve(defaultValue)),
  setStorageItem: jest.fn(() => Promise.resolve()),
  removeStorageItem: jest.fn(() => Promise.resolve()),
}));

// Mock the SmartNotificationService to avoid dependency issues
jest.mock('../app/services/SmartNotificationService', () => ({
  __esModule: true,
  default: {
    updateVehicleFavoriteStatus: jest.fn(() => Promise.resolve()),
  },
}));

// Mock the vehicles JSON data
jest.mock('../app/constants/vehicles.json', () => [
  { make: 'BMW', model: 'M3', startingBid: 25000, favourite: false, auctionDateTime: '2024/04/15 09:00:00' },
  { make: 'Audi', model: 'A4', startingBid: 30000, favourite: false, auctionDateTime: '2024/04/16 10:00:00' },
  { make: 'Tesla', model: 'Model S', startingBid: 50000, favourite: true, auctionDateTime: '2024/04/17 11:00:00' }
]);

describe('CarApp Store Tests', () => {
  let store;

  beforeEach(() => {
    // Create store with the real reducer
    store = configureStore({
      reducer: {
        vehicles: vehiclesReducer
      }
    });
  });

  describe('Real Vehicle Actions', () => {
    test('should toggle favorite status on real vehicles', () => {
      const initialState = store.getState();
      
      // Should have vehicles loaded from JSON
      expect(initialState.vehicles.allVehicles.length).toBeGreaterThan(0);
      
      const firstVehicle = initialState.vehicles.allVehicles[0];
      const originalFavoriteState = firstVehicle.favourite;
      
      // Toggle favorite
      store.dispatch(toggleFavorite(firstVehicle.id));
      
      const newState = store.getState();
      const updatedVehicle = newState.vehicles.allVehicles.find(v => v.id === firstVehicle.id);
      
      expect(updatedVehicle.favourite).toBe(!originalFavoriteState);
    });

    test('should set filters and update filtered vehicles', () => {
      // Set BMW filter
      store.dispatch(setFilters({ make: 'BMW' }));
      
      const state = store.getState();
      
      expect(state.vehicles.filters.make).toBe('BMW');
      expect(state.vehicles.filteredVehicles.every(v => 
        v.make.toLowerCase().includes('bmw')
      )).toBe(true);
    });

    test('should reset filters to default', () => {
      // First set some filters
      store.dispatch(setFilters({ make: 'BMW', showFavoritesOnly: true }));
      
      // Then reset
      store.dispatch(resetFilters());
      
      const state = store.getState();
      
      expect(state.vehicles.filters).toEqual(defaultFilters);
      expect(state.vehicles.filteredVehicles).toEqual(state.vehicles.allVehicles);
    });

    test('should filter by price range', () => {
      store.dispatch(setFilters({ minBid: 25000, maxBid: 35000 }));
      
      const state = store.getState();
      
      expect(state.vehicles.filteredVehicles.every(v => 
        v.startingBid >= 25000 && v.startingBid <= 35000
      )).toBe(true);
    });

    test('should filter by favorites only', () => {
      store.dispatch(setFilters({ showFavoritesOnly: true }));
      
      const state = store.getState();
      
      expect(state.vehicles.filteredVehicles.every(v => v.favourite === true)).toBe(true);
    });

    test('should combine multiple filters', () => {
      store.dispatch(setFilters({ 
        make: 'BMW', 
        minBid: 20000,
        maxBid: 30000 
      }));
      
      const state = store.getState();
      
      expect(state.vehicles.filteredVehicles.every(v => 
        v.make.toLowerCase().includes('bmw') && 
        v.startingBid >= 20000 && 
        v.startingBid <= 30000
      )).toBe(true);
    });
  });

  describe('Store Structure & Data Integrity', () => {
    test('should have correct initial state structure', () => {
      const state = store.getState();
      
      expect(state).toHaveProperty('vehicles');
      expect(state.vehicles).toHaveProperty('allVehicles');
      expect(state.vehicles).toHaveProperty('filteredVehicles');
      expect(state.vehicles).toHaveProperty('filters');
      
      // Should match default filters structure
      expect(state.vehicles.filters).toEqual(defaultFilters);
    });

    test('should load vehicles with proper structure', () => {
      const state = store.getState();
      
      expect(Array.isArray(state.vehicles.allVehicles)).toBe(true);
      expect(state.vehicles.allVehicles.length).toBeGreaterThan(0);
      
      // Check vehicle structure
      const vehicle = state.vehicles.allVehicles[0];
      expect(vehicle).toHaveProperty('id');
      expect(vehicle).toHaveProperty('make');
      expect(vehicle).toHaveProperty('model');
      expect(vehicle).toHaveProperty('startingBid');
      expect(vehicle).toHaveProperty('favourite');
      expect(vehicle).toHaveProperty('auctionDateTime');
    });

    test('should maintain vehicle IDs correctly', () => {
      const state = store.getState();
      
      const ids = state.vehicles.allVehicles.map(v => v.id);
      const uniqueIds = [...new Set(ids)];
      
      // All IDs should be unique
      expect(ids.length).toBe(uniqueIds.length);
      
      // IDs should be numbers
      expect(ids.every(id => typeof id === 'number')).toBe(true);
    });

    test('should preserve all vehicles when filtering', () => {
      const initialState = store.getState();
      const totalVehicles = initialState.vehicles.allVehicles.length;
      
      // Apply filter that might return no results
      store.dispatch(setFilters({ make: 'NonExistentBrand' }));
      
      const state = store.getState();
      
      // All vehicles should still exist in allVehicles
      expect(state.vehicles.allVehicles.length).toBe(totalVehicles);
      
      // But filtered should be empty
      expect(state.vehicles.filteredVehicles.length).toBe(0);
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle case-insensitive make filtering', () => {
      store.dispatch(setFilters({ make: 'bmw' })); // lowercase
      
      const state = store.getState();
      
      if (state.vehicles.filteredVehicles.length > 0) {
        expect(state.vehicles.filteredVehicles.every(v => 
          v.make.toLowerCase().includes('bmw')
        )).toBe(true);
      }
    });

    test('should handle partial model matching', () => {
      store.dispatch(setFilters({ model: 'M' })); // partial match
      
      const state = store.getState();
      
      if (state.vehicles.filteredVehicles.length > 0) {
        expect(state.vehicles.filteredVehicles.every(v => 
          v.model.toLowerCase().includes('m')
        )).toBe(true);
      }
    });

    test('should maintain state consistency after multiple operations', () => {
      // Perform multiple operations
      store.dispatch(toggleFavorite(1));
      store.dispatch(setFilters({ make: 'BMW' }));
      store.dispatch(toggleFavorite(2));
      store.dispatch(resetFilters());
      
      const state = store.getState();
      
      // State should still be valid
      expect(Array.isArray(state.vehicles.allVehicles)).toBe(true);
      expect(Array.isArray(state.vehicles.filteredVehicles)).toBe(true);
      expect(typeof state.vehicles.filters).toBe('object');
      
      // Filters should be reset
      expect(state.vehicles.filters).toEqual(defaultFilters);
    });
  });
});

// Context API Action Types Tests
describe('AuthContext Action Types', () => {
  test('should have all required action types', () => {
    expect(AUTH_ACTIONS).toHaveProperty('SET_LOADING');
    expect(AUTH_ACTIONS).toHaveProperty('LOGIN_SUCCESS');
    expect(AUTH_ACTIONS).toHaveProperty('LOGOUT');
    expect(AUTH_ACTIONS).toHaveProperty('SET_USER');
    expect(AUTH_ACTIONS).toHaveProperty('SET_HAS_SEEN_LANDING');
    expect(AUTH_ACTIONS).toHaveProperty('TOGGLE_THEME');
  });

  test('should have correct action type values', () => {
    expect(AUTH_ACTIONS.SET_LOADING).toBe('SET_LOADING');
    expect(AUTH_ACTIONS.LOGIN_SUCCESS).toBe('LOGIN_SUCCESS');
    expect(AUTH_ACTIONS.LOGOUT).toBe('LOGOUT');
    expect(AUTH_ACTIONS.SET_USER).toBe('SET_USER');
    expect(AUTH_ACTIONS.SET_HAS_SEEN_LANDING).toBe('SET_HAS_SEEN_LANDING');
    expect(AUTH_ACTIONS.TOGGLE_THEME).toBe('TOGGLE_THEME');
  });
});

// Storage Utilities Tests
describe('Storage Utilities', () => {
  let mockGetStorageItem, mockSetStorageItem, mockRemoveStorageItem;

  beforeEach(() => {
    // Reset mocks before each test
    mockGetStorageItem = require('../app/utils').getStorageItem;
    mockSetStorageItem = require('../app/utils').setStorageItem;
    mockRemoveStorageItem = require('../app/utils').removeStorageItem;
    
    mockGetStorageItem.mockClear();
    mockSetStorageItem.mockClear();
    mockRemoveStorageItem.mockClear();
  });

  test('should mock getStorageItem correctly', async () => {
    mockGetStorageItem.mockResolvedValue('test-value');
    
    const result = await mockGetStorageItem('test-key');
    expect(result).toBe('test-value');
    expect(mockGetStorageItem).toHaveBeenCalledWith('test-key');
  });

  test('should mock setStorageItem correctly', async () => {
    mockSetStorageItem.mockResolvedValue();
    
    await mockSetStorageItem('test-key', 'test-value');
    expect(mockSetStorageItem).toHaveBeenCalledWith('test-key', 'test-value');
  });

  test('should mock removeStorageItem correctly', async () => {
    mockRemoveStorageItem.mockResolvedValue();
    
    await mockRemoveStorageItem('test-key');
    expect(mockRemoveStorageItem).toHaveBeenCalledWith('test-key');
  });

  test('should handle storage operations with default values', async () => {
    mockGetStorageItem.mockImplementation((key, defaultValue) => Promise.resolve(defaultValue));
    
    const result = await mockGetStorageItem('non-existent-key', 'default-value');
    expect(result).toBe('default-value');
  });

  test('should handle storage failures gracefully', async () => {
    mockSetStorageItem.mockRejectedValue(new Error('Storage failed'));
    
    try {
      await mockSetStorageItem('test-key', 'test-value');
    } catch (error) {
      expect(error.message).toBe('Storage failed');
    }
  });
});
