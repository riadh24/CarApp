// Store Tests
import store, { resetFilters, setFilters } from '../app/Store';

// Mock Expo modules
jest.mock('expo-application', () => require('../__mocks__/expo-application'));
jest.mock('expo-modules-core', () => require('../__mocks__/expo-modules-core'));

// Mock services
jest.mock('../app/services/SmartNotificationService', () => ({}));
jest.mock('../app/modules/AuctionNotificationModule', () => ({}));
jest.mock('../app/services/ExpoGoNotificationService', () => ({}));

describe('Store Tests', () => {
  test('should have store defined', () => {
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
  });

  test('should have vehicles state', () => {
    const state = store.getState();
    expect(state.vehicles).toBeDefined();
    expect(state.vehicles.filters).toBeDefined();
  });

  test('should dispatch actions', () => {
    const initialFilters = store.getState().vehicles.filters;
    
    // Test setFilters action
    store.dispatch(setFilters({ category: 'sedan' }));
    const newState = store.getState();
    expect(newState.vehicles.filters).not.toEqual(initialFilters);
    
    // Test resetFilters action
    store.dispatch(resetFilters());
    const resetState = store.getState();
    expect(resetState.vehicles.filters).toEqual(initialFilters);
  });
});
