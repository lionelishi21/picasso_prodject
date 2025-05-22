/**
 * themeSlice.ts
 * Redux slice for theme management
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import themeService from '../services/themeService';
import type { ThemeSettings, ThemeState } from '../../types/theme';

const initialState: ThemeState = {
  themes: [],
  currentTheme: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all themes for a site
export const getSiteThemes = createAsyncThunk<
  ThemeSettings[],
  string,
  { rejectValue: string }
>(
  'theme/getSiteThemes',
  async (siteId: string, thunkAPI) => {
    try {
      return await themeService.getSiteThemes(siteId);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to load themes';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get theme by ID
export const getThemeById = createAsyncThunk<
  ThemeSettings,
  string,
  { rejectValue: string }
>(
  'theme/getThemeById',
  async (themeId: string, thunkAPI) => {
    try {
      return await themeService.getThemeById(themeId);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to load theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get default theme for site
export const getDefaultTheme = createAsyncThunk<
  ThemeSettings,
  string,
  { rejectValue: string }
>(
  'theme/getDefault',
  async (siteId: string, thunkAPI) => {
    try {
      return await themeService.getDefaultTheme(siteId);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to load theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new theme
export const createTheme = createAsyncThunk<
  ThemeSettings,
  ThemeSettings,
  { rejectValue: string }
>(
  'theme/createTheme',
  async (themeData: ThemeSettings, thunkAPI) => {
    try {
      return await themeService.createTheme(themeData);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to create theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update theme
export const updateTheme = createAsyncThunk<
  ThemeSettings,
  { themeId: string; themeData: ThemeSettings },
  { rejectValue: string }
>(
  'theme/update',
  async ({ themeId, themeData }, thunkAPI) => {
    try {
      return await themeService.updateTheme(themeId, themeData);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to update theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete theme
export const deleteTheme = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'theme/deleteTheme',
  async (themeId: string, thunkAPI) => {
    try {
      return await themeService.deleteTheme(themeId);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to delete theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clone theme
export const cloneTheme = createAsyncThunk<
  ThemeSettings,
  { themeId: string; name: string },
  { rejectValue: string }
>(
  'theme/clone',
  async ({ themeId, name }, thunkAPI) => {
    try {
      return await themeService.cloneTheme(themeId, name);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to clone theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Set default theme
export const setDefaultTheme = createAsyncThunk<
  ThemeSettings,
  string,
  { rejectValue: string }
>(
  'theme/setDefaultTheme',
  async (themeId: string, thunkAPI) => {
    try {
      return await themeService.setDefaultTheme(themeId);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to set default theme';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentTheme: (state) => {
      state.currentTheme = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get site themes
      .addCase(getSiteThemes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSiteThemes.fulfilled, (state, action: PayloadAction<ThemeSettings[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes = action.payload;
      })
      .addCase(getSiteThemes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to load themes';
      })
      
      // Get theme by ID
      .addCase(getThemeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getThemeById.fulfilled, (state, action: PayloadAction<ThemeSettings>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTheme = action.payload;
      })
      .addCase(getThemeById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to load theme';
      })
      
      // Get default theme
      .addCase(getDefaultTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDefaultTheme.fulfilled, (state, action: PayloadAction<ThemeSettings>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTheme = action.payload;
      })
      .addCase(getDefaultTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to load theme';
      })
      
      // Create theme
      .addCase(createTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTheme.fulfilled, (state, action: PayloadAction<ThemeSettings>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes.push(action.payload);
        state.currentTheme = action.payload;
      })
      .addCase(createTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to create theme';
      })
      
      // Update theme
      .addCase(updateTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTheme.fulfilled, (state, action: PayloadAction<ThemeSettings>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes = state.themes.map((theme: ThemeSettings) =>
          theme.id === action.payload.id ? action.payload : theme
        );
        state.currentTheme = action.payload;
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to update theme';
      })
      
      // Delete theme
      .addCase(deleteTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTheme.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes = state.themes.filter((theme: ThemeSettings) => theme.id !== action.payload);
        if (state.currentTheme && state.currentTheme.id === action.payload) {
          state.currentTheme = null;
        }
      })
      .addCase(deleteTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to delete theme';
      })
      
      // Clone theme
      .addCase(cloneTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cloneTheme.fulfilled, (state, action: PayloadAction<ThemeSettings>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes.push(action.payload);
        state.currentTheme = action.payload;
      })
      .addCase(cloneTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to clone theme';
      })
      
      // Set default theme
      .addCase(setDefaultTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setDefaultTheme.fulfilled, (state, action: PayloadAction<ThemeSettings>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.themes = state.themes.map((theme: ThemeSettings) => ({
          ...theme,
          isDefault: theme.id === action.payload.id,
        }));
        state.currentTheme = action.payload;
      })
      .addCase(setDefaultTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to set default theme';
      });
  },
});

export const { reset, clearCurrentTheme } = themeSlice.actions;
export default themeSlice.reducer;