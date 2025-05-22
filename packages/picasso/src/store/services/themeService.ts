/**
 * themeService.ts
 * Service for theme API calls
 */
import api from './api';
import type { ThemeSettings } from '../../types/theme';

interface ApiResponse<T> {
  data: {
    data: T;
  };
}

// Get all themes for a site
const getSiteThemes = async (siteId: string): Promise<ThemeSettings[]> => {
  const response = await api.get<ApiResponse<ThemeSettings[]>>(`/themes/site/${siteId}`);
  return response.data.data;
};

// Get theme by ID
const getThemeById = async (themeId: string): Promise<ThemeSettings> => {
  const response = await api.get<ApiResponse<ThemeSettings>>(`/themes/${themeId}`);
  return response.data.data;
};

// Get default theme for site
const getDefaultTheme = async (siteId: string): Promise<ThemeSettings> => {
  const response = await api.get<ApiResponse<ThemeSettings>>(`/themes/site/${siteId}/default`);
  return response.data.data;
};

// Create new theme
const createTheme = async (themeData: ThemeSettings): Promise<ThemeSettings> => {
  const response = await api.post<ApiResponse<ThemeSettings>>('/themes', themeData);
  return response.data.data;
};

// Update theme
const updateTheme = async (themeId: string, themeData: ThemeSettings): Promise<ThemeSettings> => {
  const response = await api.put<ApiResponse<ThemeSettings>>(`/themes/${themeId}`, themeData);
  return response.data.data;
};

// Delete theme
const deleteTheme = async (themeId: string): Promise<string> => {
  await api.delete(`/themes/${themeId}`);
  return themeId; // Return the ID for use in the reducer
};

// Clone theme
const cloneTheme = async (themeId: string, name: string): Promise<ThemeSettings> => {
  const response = await api.post<ApiResponse<ThemeSettings>>(`/themes/${themeId}/clone`, { name });
  return response.data.data;
};

// Set default theme
const setDefaultTheme = async (themeId: string): Promise<ThemeSettings> => {
  const response = await api.patch<ApiResponse<ThemeSettings>>(`/themes/${themeId}/default`);
  return response.data.data;
};

const themeService = {
  getSiteThemes,
  getThemeById,
  getDefaultTheme,
  createTheme,
  updateTheme,
  deleteTheme,
  cloneTheme,
  setDefaultTheme,
};

export default themeService;