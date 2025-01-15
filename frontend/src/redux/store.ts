// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import themeSlice from './slices/themeSlice';
import blogSlice from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    blog: blogSlice
  },
});
