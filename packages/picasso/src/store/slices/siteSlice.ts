/**
 * siteSlice.js
 * Redux slice for site management
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import siteService from '../services/siteService';

interface Site {
  id: string;
  name: string;
  domain: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'building';
  config: {
    currency: string;
    languageCode: string;
    timezone: string;
  };
}

interface SiteState {
  sites: Site[];
  currentSite: Site | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface MenuItem {
  label: string;
  url: string;
  order: number;
}

// Initial state
const initialState: SiteState = {
  sites: [],
  currentSite: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Helper function to handle error messages
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } }; message?: string };
    return apiError.response?.data?.message || apiError.message || 'Something went wrong';
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'Something went wrong';
};

// Get all sites for current user
export const getUserSites = createAsyncThunk<Site[], void, { state: RootState; rejectValue: string }>(
  'site/getUserSites',
  async (_, thunkAPI) => {
      try {
        const userId = thunkAPI.getState().auth.user?.user?._id;
      return await siteService.getUserSites(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Get site by ID
export const getSiteById = createAsyncThunk<Site, string, { state: RootState; rejectValue: string }>(
  'site/getSiteById',
  async (siteId, thunkAPI) => {
    try {
      return await siteService.getSiteById(siteId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create new site
export const createSite = createAsyncThunk<Site, {
  owner: string;
  name: string;
  domain: string;
  description?: string;
  logo?: string | File;
}, { state: RootState; rejectValue: string }>(
  'site/createSite',
  async (siteData, thunkAPI) => {
    try {
      return await siteService.createSite(siteData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update site
export const updateSite = createAsyncThunk<Site, { siteId: string; siteData: Partial<Site> }, { state: RootState; rejectValue: string }>(
  'site/updateSite',
  async ({ siteId, siteData }, thunkAPI) => {
    try {
      return await siteService.updateSite(siteId, siteData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete site
export const deleteSite = createAsyncThunk<string, string, { state: RootState; rejectValue: string }>(
  'site/deleteSite',
  async (siteId, thunkAPI) => {
    try {
      return await siteService.deleteSite(siteId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update site menu
export const updateSiteMenu = createAsyncThunk<Site, { siteId: string; menuItems: MenuItem[] }, { state: RootState; rejectValue: string }>(
  'site/updateSiteMenu',
  async ({ siteId, menuItems }, thunkAPI) => {
    try {
      return await siteService.updateSiteMenu(siteId, menuItems);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update site status
export const updateSiteStatus = createAsyncThunk<Site, { siteId: string; status: Site['status'] }, { state: RootState; rejectValue: string }>(
  'site/updateSiteStatus',
  async ({ siteId, status }, thunkAPI) => {
    try {
      return await siteService.updateSiteStatus(siteId, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Site slice
const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentSite: (state) => {
      state.currentSite = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user sites
      .addCase(getUserSites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserSites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites = action.payload;
      })
      .addCase(getUserSites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get site by ID
      .addCase(getSiteById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSiteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSite = action.payload;
      })
      .addCase(getSiteById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create site
      .addCase(createSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites.push(action.payload);
        state.currentSite = action.payload;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update site
      .addCase(updateSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites = state.sites.map((site) =>
          site.id === action.payload.id ? action.payload : site
        );
        state.currentSite = action.payload;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete site
      .addCase(deleteSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites = state.sites.filter((site) => site.id !== action.payload);
        if (state.currentSite && state.currentSite.id === action.payload) {
          state.currentSite = null;
        }
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update site menu
      .addCase(updateSiteMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSiteMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites = state.sites.map((site) =>
          site.id === action.payload.id ? action.payload : site
        );
        state.currentSite = action.payload;
      })
      .addCase(updateSiteMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update site status
      .addCase(updateSiteStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSiteStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites = state.sites.map((site) =>
          site.id === action.payload.id ? action.payload : site
        );
        state.currentSite = action.payload;
      })
      .addCase(updateSiteStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentSite } = siteSlice.actions;
export default siteSlice.reducer;