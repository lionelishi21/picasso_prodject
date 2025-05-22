/**
 * store.js
 * Redux store configuration
 */
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import siteReducer from './slices/siteSlice';
import pageReducer from './slices/pageSlice';
import themeReducer from './slices/themeSlice';
import editorReducer from './slices/editorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    site: siteReducer,
    page: pageReducer,
    theme: themeReducer,
    editor: editorReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();