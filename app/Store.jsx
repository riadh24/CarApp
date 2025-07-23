import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import vehiclesData from './constants/vehicles.json';
import SmartNotificationService from './services/SmartNotificationService';

// Utility function to safely parse dates
export const parseVehicleDate = (dateString) => {
  if (!dateString) return null;
  try {
    // Handle both formats: "2024/04/15 09:00:00" and "2024-04-15 09:00:00"
    const normalizedDate = dateString.replace(/\//g, '-');
    const date = new Date(normalizedDate);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('Failed to parse date:', dateString, error);
    return null;
  }
};

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    email: '',
    avatar: 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?w=1380',
    isAuthenticated: false,
    hasSeenLanding: false,
    isDarkTheme: true,
  },
  reducers: {
    setProfile: (state, action) => {
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.isAuthenticated = true;
    },
    setHasSeenLanding: (state, action) => {
      state.hasSeenLanding = action.payload !== undefined ? action.payload : true;
    },
    toggleTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
    logout: (state) => {
      state.email = '';
      state.avatar = 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?w=1380';
      state.isAuthenticated = false;
      state.hasSeenLanding = false;
    },
  },
});

const vehiclesWithIds = vehiclesData.map((vehicle, index) => ({
  ...vehicle,
  id: index + 1,
  auctionDateTime: vehicle.auctionDateTime, // Keep as string for Redux serialization
}));

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

// Vehicles slice for vehicle data and filtering
const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: {
    allVehicles: vehiclesWithIds,
    filteredVehicles: vehiclesWithIds,
    filters: defaultFilters,
  },
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
  },
});

export const { setProfile, setHasSeenLanding, toggleTheme, logout } = profileSlice.actions;
export const { toggleFavorite, setFilters, resetFilters } = vehiclesSlice.actions;

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['profile', 'vehicles'],
};

const rootReducer = combineReducers({
  profile: profileSlice.reducer,
  vehicles: vehiclesSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PURGE',
          'persist/FLUSH',
          'persist/PAUSE',
        ],
        ignoredPaths: ['_persist'],
      },
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Clear persisted data (useful for development)
export const clearPersistedData = async () => {
  try {
    await AsyncStorage.removeItem('persist:root');
    console.log('Persisted data cleared');
    // Optionally reload the app
    if (__DEV__) {
      console.log('Please reload the app to see changes');
    }
  } catch (error) {
    console.error('Failed to clear persisted data:', error);
  }
};

export default store;