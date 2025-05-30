/**
 * pageSlice.js
 * Redux slice for page management
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pageService from '../services/pageService';
import type { Page } from '../../types/page';

interface PageState {
  pages: Page[];
  currentPage: Page | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

// Initial state
const initialState: PageState = {
  pages: [],
  currentPage: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all pages for a site
export const getSitePages = createAsyncThunk<Page[], { siteId: string, options: any }>(
  'page/getSitePages',
  async ({ siteId, options }, thunkAPI) => {
    try {
      return await pageService.getSitePages(siteId, options);
    } catch (err) {
      return thunkAPI.rejectWithValue(err);  
    }
  }
);

// Get page by ID
export const getPageById = createAsyncThunk(
  'page/getPageById',
  async (pageId, thunkAPI) => {
    try {
      return await pageService.getPageById(pageId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new page
export const createPage = createAsyncThunk<Page, Partial<Page>>(
  'page/createPage',
  async (pageData, thunkAPI) => {
    try {
      return await pageService.createPage(pageData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update page
export const updatePage = createAsyncThunk(
  'page/updatePage',
  async ({ pageId, pageData }, thunkAPI) => {
    try {
      return await pageService.updatePage(pageId, pageData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete page
export const deletePage = createAsyncThunk<string, string>(
  'page/deletePage',
  async (pageId, thunkAPI) => {
    try {
      return await pageService.deletePage(pageId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clone page
interface ClonePagePayload {
  pageId: string;
  name: string;
  path: string;
}

export const clonePage = createAsyncThunk<Page, ClonePagePayload>(
  'page/clonePage',
  async (payload, thunkAPI) => {
    try {
      return await pageService.clonePage(payload);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle page published status
export const togglePagePublished = createAsyncThunk(
  'page/togglePagePublished',
  async ({ pageId, published }, thunkAPI) => {
    try {
      return await pageService.togglePagePublished(pageId, published);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Page slice
const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get site pages
      .addCase(getSitePages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSitePages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log('getSitePages action.payload', action.payload);
        state.pages = action.payload;
      })
      .addCase(getSitePages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get page by ID
      .addCase(getPageById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPage = action.payload;
      })
      .addCase(getPageById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create page
      .addCase(createPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pages.push(action.payload);
        state.currentPage = action.payload;
      })
      .addCase(createPage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update page
      .addCase(updatePage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pages = state.pages.map((page) =>
          page.id === action.payload.id ? action.payload : page
        );
        state.currentPage = action.payload;
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete page
      .addCase(deletePage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pages = state.pages.filter((page) => page.id !== action.payload);
        if (state.currentPage && state.currentPage.id === action.payload) {
          state.currentPage = null;
        }
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Clone page
      .addCase(clonePage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clonePage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pages.push(action.payload);
        state.currentPage = action.payload;
      })
      .addCase(clonePage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Toggle page published status
      .addCase(togglePagePublished.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(togglePagePublished.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pages = state.pages.map((page) =>
          page.id === action.payload.id ? action.payload : page
        );
        state.currentPage = action.payload;
      })
      .addCase(togglePagePublished.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentPage } = pageSlice.actions;
export default pageSlice.reducer;