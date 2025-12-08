
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/colors`;

// Async thunks
export const fetchColors = createAsyncThunk(
  'colors/fetchColors',
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
      return rejectWithValue(error.message || 'Failed to fetch colors');
    }
  }
);

export const createColor = createAsyncThunk(
  'colors/createColor',
  async (colorData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colorData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create color');
    }
  }
);

export const updateColor = createAsyncThunk(
  'colors/updateColor',
  async ({ id, colorData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colorData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update color');
    }
  }
);

export const deleteColor = createAsyncThunk(
  'colors/deleteColor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return id;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete color');
    }
  }
);

export const toggleColorStatus = createAsyncThunk(
  'colors/toggleColorStatus',
  async (color, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${color._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...color, isActive: !color.isActive })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle color status');
    }
  }
);

const colorSlice = createSlice({
  name: 'colors',
  initialState: {
    colors: [],
    filteredColors: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredColors = state.colors.filter(color =>
        color.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        color.hexCode?.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch colors
      .addCase(fetchColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload;
        state.filteredColors = action.payload.filter(color =>
          color.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          color.hexCode?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create color
      .addCase(createColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors.push(action.payload);
        state.filteredColors = state.colors.filter(color =>
          color.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          color.hexCode?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Color created successfully!', type: 'success' };
      })
      .addCase(createColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update color
      .addCase(updateColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.colors.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.colors[index] = action.payload;
        }
        state.filteredColors = state.colors.filter(color =>
          color.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          color.hexCode?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Color updated successfully!', type: 'success' };
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete color
      .addCase(deleteColor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = state.colors.filter(c => c._id !== action.payload);
        state.filteredColors = state.colors.filter(color =>
          color.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          color.hexCode?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Color deleted successfully!', type: 'success' };
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleColorStatus.fulfilled, (state, action) => {
        const index = state.colors.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.colors[index] = action.payload;
        }
        state.filteredColors = state.colors.filter(color =>
          color.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          color.hexCode?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Color ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleColorStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = colorSlice.actions;
export default colorSlice.reducer;