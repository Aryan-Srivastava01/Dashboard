import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboard';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

export default store;