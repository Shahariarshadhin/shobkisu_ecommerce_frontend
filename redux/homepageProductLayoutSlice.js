import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/homepage-layouts`;

// Async thunks
export const fetchLayouts = createAsyncThunk(
  'homepageLayout/fetchLayouts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch layouts');
    }
  }
);

export const fetchActiveLayouts = createAsyncThunk(
  'homepageLayout/fetchActiveLayouts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch active layouts');
    }
  }
);

export const fetchLayoutById = createAsyncThunk(
  'homepageLayout/fetchLayoutById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch layout');
    }
  }
);

export const createLayout = createAsyncThunk(
  'homepageLayout/createLayout',
  async (layoutData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layoutData)
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create layout');
    }
  }
);

export const updateLayout = createAsyncThunk(
  'homepageLayout/updateLayout',
  async ({ id, layoutData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layoutData)
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update layout');
    }
  }
);

export const addProductsToLayout = createAsyncThunk(
  'homepageLayout/addProductsToLayout',
  async ({ id, products }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/add-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add products');
    }
  }
);

export const removeProductsFromLayout = createAsyncThunk(
  'homepageLayout/removeProductsFromLayout',
  async ({ id, products }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/remove-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove products');
    }
  }
);

export const toggleLayoutStatus = createAsyncThunk(
  'homepageLayout/toggleLayoutStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle-status`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle layout status');
    }
  }
);

export const deleteLayout = createAsyncThunk(
  'homepageLayout/deleteLayout',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        return id;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete layout');
    }
  }
);

export const reorderLayouts = createAsyncThunk(
  'homepageLayout/reorderLayouts',
  async (layouts, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layouts })
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reorder layouts');
    }
  }
);

const homepageLayoutSlice = createSlice({
  name: 'homepageLayout',
  initialState: {
    layouts: [],
    activeLayouts: [],
    currentLayout: null,
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    clearNotification: (state) => {
      state.notification = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLayout: (state) => {
      state.currentLayout = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all layouts
      .addCase(fetchLayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.layouts = action.payload;
      })
      .addCase(fetchLayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Fetch active layouts
      .addCase(fetchActiveLayouts.fulfilled, (state, action) => {
        state.activeLayouts = action.payload;
      })
      // Fetch single layout
      .addCase(fetchLayoutById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLayoutById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLayout = action.payload;
      })
      .addCase(fetchLayoutById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create layout
      .addCase(createLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.layouts.push(action.payload);
        state.notification = { message: 'Layout created successfully!', type: 'success' };
      })
      .addCase(createLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update layout
      .addCase(updateLayout.fulfilled, (state, action) => {
        const index = state.layouts.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.layouts[index] = action.payload;
        }
        state.notification = { message: 'Layout updated successfully!', type: 'success' };
      })
      // Add products
      .addCase(addProductsToLayout.fulfilled, (state, action) => {
        const index = state.layouts.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.layouts[index] = action.payload;
        }
        state.notification = { message: 'Products added successfully!', type: 'success' };
      })
      // Remove products
      .addCase(removeProductsFromLayout.fulfilled, (state, action) => {
        const index = state.layouts.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.layouts[index] = action.payload;
        }
        state.notification = { message: 'Products removed successfully!', type: 'success' };
      })
      // Toggle status
      .addCase(toggleLayoutStatus.fulfilled, (state, action) => {
        const index = state.layouts.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.layouts[index] = action.payload;
        }
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Layout ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      // Delete layout
      .addCase(deleteLayout.fulfilled, (state, action) => {
        state.layouts = state.layouts.filter(l => l._id !== action.payload);
        state.notification = { message: 'Layout deleted successfully!', type: 'success' };
      })
      // Reorder layouts
      .addCase(reorderLayouts.fulfilled, (state, action) => {
        state.layouts = action.payload;
        state.notification = { message: 'Layouts reordered successfully!', type: 'success' };
      });
  }
});

export const { clearNotification, clearError, clearCurrentLayout } = homepageLayoutSlice.actions;
export default homepageLayoutSlice.reducer;