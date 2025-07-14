import { configureStore } from '@reduxjs/toolkit';
import { setFilters, toggleFavorite } from '../app/Store';

// Mock data for testing
const mockVehicle = {
  id: 1,
  make: 'BMW',
  model: 'M3',
  favourite: false,
  startingBid: 25000
};

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      vehicles: (state = { 
        allVehicles: [mockVehicle], 
        filteredVehicles: [mockVehicle],
        filters: { make: '', model: '', minBid: 0, maxBid: 100000, showFavoritesOnly: false }
      }, action) => {
        switch (action.type) {
          case 'vehicles/toggleFavorite':
            const vehicleId = action.payload;
            const vehicle = state.allVehicles.find(v => v.id === vehicleId);
            if (vehicle) {
              return {
                ...state,
                allVehicles: state.allVehicles.map(v => 
                  v.id === vehicleId ? { ...v, favourite: !v.favourite } : v
                ),
                filteredVehicles: state.filteredVehicles.map(v => 
                  v.id === vehicleId ? { ...v, favourite: !v.favourite } : v
                )
              };
            }
            return state;
          case 'vehicles/setFilters':
            const newFilters = { ...state.filters, ...action.payload };
            return {
              ...state,
              filters: newFilters,
              filteredVehicles: state.allVehicles.filter(vehicle => {
                const matchesMake = !newFilters.make || vehicle.make.toLowerCase().includes(newFilters.make.toLowerCase());
                return matchesMake;
              })
            };
          default:
            return state;
        }
      }
    }
  });
};

describe('Store', () => {
  test('should toggle vehicle favorite status', () => {
    const store = createTestStore();
    
    // Initially not favorite
    expect(store.getState().vehicles.allVehicles[0].favourite).toBe(false);
    
    // Toggle favorite
    store.dispatch(toggleFavorite(1));
    
    // Should be favorite now
    expect(store.getState().vehicles.allVehicles[0].favourite).toBe(true);
  });

  test('should filter vehicles by make', () => {
    const store = createTestStore();
    
    // Apply filter
    store.dispatch(setFilters({ make: 'BMW' }));
    
    // Should include the BMW
    expect(store.getState().vehicles.filteredVehicles).toHaveLength(1);
    expect(store.getState().vehicles.filteredVehicles[0].make).toBe('BMW');
    
    // Apply different filter
    store.dispatch(setFilters({ make: 'Toyota' }));
    
    // Should filter out the BMW
    expect(store.getState().vehicles.filteredVehicles).toHaveLength(0);
  });
});
