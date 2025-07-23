// Vehicle action types
export const VEHICLE_ACTIONS = {
  TOGGLE_FAVORITE: 'vehicles/toggleFavorite',
  SET_FILTERS: 'vehicles/setFilters',
  RESET_FILTERS: 'vehicles/resetFilters',
  LOAD_VEHICLES: 'vehicles/loadVehicles',
  UPDATE_VEHICLE: 'vehicles/updateVehicle',
};

// Vehicle action creators
export const vehicleActions = {
  toggleFavorite: (vehicleId) => ({
    type: VEHICLE_ACTIONS.TOGGLE_FAVORITE,
    payload: vehicleId,
  }),
  
  setFilters: (filters) => ({
    type: VEHICLE_ACTIONS.SET_FILTERS,
    payload: filters,
  }),
  
  resetFilters: () => ({
    type: VEHICLE_ACTIONS.RESET_FILTERS,
  }),
  
  loadVehicles: (vehicles) => ({
    type: VEHICLE_ACTIONS.LOAD_VEHICLES,
    payload: vehicles,
  }),
  
  updateVehicle: (vehicleId, updates) => ({
    type: VEHICLE_ACTIONS.UPDATE_VEHICLE,
    payload: { vehicleId, updates },
  }),
};
