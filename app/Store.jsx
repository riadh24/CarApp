// Re-export store and persistor
export { default, persistor } from './store/index';

// Re-export vehicle actions for backward compatibility
export {
  loadVehicles, resetFilters, setFilters, toggleFavorite, updateVehicle
} from './store/reducers/vehiclesReducer';

