import { combineReducers } from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesReducer';

const rootReducer = combineReducers({
  vehicles: vehiclesReducer,
});

export default rootReducer;
