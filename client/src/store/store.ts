import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pdfReducer from './pdfSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    pdf: pdfReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;