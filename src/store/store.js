import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import farmhouseReducer from './slices/farmhouseSlice';
import bookingReducer from './slices/bookingSlice';
import adminReducer from './slices/adminSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    farmhouse: farmhouseReducer,
    booking: bookingReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
