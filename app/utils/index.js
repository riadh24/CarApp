// Main utility exports - centralized access to all utilities
export * from './arrayUtils';
export * from './dateUtils';
export * from './platformUtils';
export * from './searchUtils';
export * from './storageUtils';
export * from './stringUtils';
export * from './validationUtils';

export { parseDate as parseVehicleDate } from './dateUtils';

export const getStoreState = (store) => store.getState();

export const subscribeToStore = (store, listener) => store.subscribe(listener);

export const createAsyncAction = (type) => ({
  request: `${type}_REQUEST`,
  success: `${type}_SUCCESS`,
  failure: `${type}_FAILURE`,
});

// Store selector helpers
export const createSelector = (selector) => (state) => selector(state);

// Debug utilities for development
export const logStoreState = (store, label = 'Store State') => {
  if (__DEV__) {
    console.group(label);
    console.log(store.getState());
    console.groupEnd();
  }
};

