// Filter Tests
import store, { resetFilters, setFilters } from '../app/Store';

// Mock Expo modules
jest.mock('expo-application', () => require('../__mocks__/expo-application'));
jest.mock('expo-modules-core', () => require('../__mocks__/expo-modules-core'));

// Mock services
jest.mock('../app/services/SmartNotificationService', () => ({}));
jest.mock('../app/modules/AuctionNotificationModule', () => ({}));
jest.mock('../app/services/ExpoGoNotificationService', () => ({}));

describe('Filter Logic Tests', () => {
  test('should set filters correctly', () => {
    const testFilters = { 
      make: 'BMW', 
      model: 'X5',
      minBid: 10000,
      maxBid: 50000 
    };
    
    store.dispatch(setFilters(testFilters));
    const state = store.getState();
    
    expect(state.vehicles.filters).toMatchObject(testFilters);
  });

  test('should reset filters to default', () => {
    // First set some filters
    store.dispatch(setFilters({ make: 'Audi', model: 'A4' }));
    
    // Get initial state
    const stateWithFilters = store.getState();
    expect(stateWithFilters.vehicles.filters.make).toBe('Audi');
    
    // Reset filters
    store.dispatch(resetFilters());
    const resetState = store.getState();
    
    // Verify filters are reset to defaults
    expect(resetState.vehicles.filters.make).toBe('');
    expect(resetState.vehicles.filters.model).toBe('');
    expect(resetState.vehicles.filters.minBid).toBe(0);
    expect(resetState.vehicles.filters.maxBid).toBe(100000);
    expect(resetState.vehicles.filters.showFavoritesOnly).toBe(false);
  });

  test('should handle partial filter updates', () => {
    // Reset to clean state
    store.dispatch(resetFilters());
    
    // Set only make filter
    store.dispatch(setFilters({ make: 'Tesla' }));
    let state = store.getState();
    expect(state.vehicles.filters.make).toBe('Tesla');
    expect(state.vehicles.filters.model).toBe('');
    
    // Add model filter without affecting make
    store.dispatch(setFilters({ model: 'Model S' }));
    state = store.getState();
    expect(state.vehicles.filters.make).toBe('Tesla');
    expect(state.vehicles.filters.model).toBe('Model S');
  });

  test('should handle empty filter values', () => {
    store.dispatch(setFilters({}));
    const state = store.getState();
    
    expect(state.vehicles.filters).toBeDefined();
  });

  test('should handle invalid filter data gracefully', () => {
    expect(() => {
      store.dispatch(setFilters(null));
    }).not.toThrow();
    
    expect(() => {
      store.dispatch(setFilters(undefined));
    }).not.toThrow();
  });

  test('should handle bid range filters', () => {
    store.dispatch(setFilters({ minBid: 20000, maxBid: 60000 }));
    const state = store.getState();
    
    expect(state.vehicles.filters.minBid).toBe(20000);
    expect(state.vehicles.filters.maxBid).toBe(60000);
  });

  test('should handle favorites filter', () => {
    store.dispatch(setFilters({ showFavoritesOnly: true }));
    const state = store.getState();
    
    expect(state.vehicles.filters.showFavoritesOnly).toBe(true);
  });
});
