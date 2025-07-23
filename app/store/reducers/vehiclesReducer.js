import { createSlice } from '@reduxjs/toolkit';
import vehiclesData from '../../constants/vehicles.json';
import SmartNotificationService from '../../services/SmartNotificationService';

// Transform vehicles data with IDs
const vehiclesWithIds = vehiclesData.map((vehicle, index) => ({
  ...vehicle,
  id: index + 1,
  auctionDateTime: vehicle.auctionDateTime, 
}));

// Default filter values
const defaultFilters = {
  make: '',
  model: '',
  minBid: 0,
  maxBid: 100000,
  showFavoritesOnly: false,
};

const applyFiltersToVehicles = (vehicles, filters) => {
  const { make, model, minBid, maxBid, showFavoritesOnly } = filters;
  return vehicles.filter(vehicle => {
    const matchesMake = !make || vehicle.make.toLowerCase().includes(make.toLowerCase());
    const matchesModel = !model || vehicle.model.toLowerCase().includes(model.toLowerCase());
    const matchesBid = vehicle.startingBid >= minBid && vehicle.startingBid <= maxBid;
    const matchesFavorites = !showFavoritesOnly || vehicle.favourite;
    
    return matchesMake && matchesModel && matchesBid && matchesFavorites;
  });
};

const initialState = {
  allVehicles: vehiclesWithIds,
  filteredVehicles: vehiclesWithIds,
  filters: defaultFilters,
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const vehicleId = action.payload;
      
      const vehicle = state.allVehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        vehicle.favourite = !vehicle.favourite;
        SmartNotificationService.updateVehicleFavoriteStatus(vehicle, vehicle.favourite).catch(() => {});
      }
      
      const filteredVehicle = state.filteredVehicles.find(v => v.id === vehicleId);
      if (filteredVehicle) {
        filteredVehicle.favourite = !filteredVehicle.favourite;
      }
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredVehicles = applyFiltersToVehicles(state.allVehicles, state.filters);
    },
    
    resetFilters: (state) => {
      state.filters = defaultFilters;
      state.filteredVehicles = state.allVehicles;
    },
    
    loadVehicles: (state, action) => {
      state.allVehicles = action.payload;
      state.filteredVehicles = applyFiltersToVehicles(action.payload, state.filters);
    },
    
    updateVehicle: (state, action) => {
      const { vehicleId, updates } = action.payload;
      
      const vehicleIndex = state.allVehicles.findIndex(v => v.id === vehicleId);
      if (vehicleIndex !== -1) {
        state.allVehicles[vehicleIndex] = { ...state.allVehicles[vehicleIndex], ...updates };
      }
      
      state.filteredVehicles = applyFiltersToVehicles(state.allVehicles, state.filters);
    },
  },
});

export const { toggleFavorite, setFilters, resetFilters, loadVehicles, updateVehicle } = vehiclesSlice.actions;
export { applyFiltersToVehicles, defaultFilters };
export default vehiclesSlice.reducer;
