// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import generalSlice from './slices/generalSlice';
import blogSlice from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    general: generalSlice,
    blog: blogSlice
  },
});

// Add these type exports
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch