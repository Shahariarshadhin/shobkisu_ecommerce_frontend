import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/warranties`;

// Async thunks
export const fetchWarranties = createAsyncThunk(
  'warranties/fetchWarranties',
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
      return rejectWithValue(error.message || 'Failed to fetch warranties');
    }
  }
);

export const createWarranty = createAsyncThunk(
  'warranties/createWarranty',
  async (warrantyData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warrantyData)
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
      return rejectWithValue(error.message || 'Failed to create warranty');
    }
  }
);

export const updateWarranty = createAsyncThunk(
  'warranties/updateWarranty',
  async ({ id, warrantyData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warrantyData)
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
      return rejectWithValue(error.message || 'Failed to update warranty');
    }
  }
);

export const deleteWarranty = createAsyncThunk(
  'warranties/deleteWarranty',
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
      return rejectWithValue(error.message || 'Failed to delete warranty');
    }
  }
);

export const toggleWarrantyStatus = createAsyncThunk(
  'warranties/toggleWarrantyStatus',
  async (warranty, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${warranty._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...warranty, isActive: !warranty.isActive })
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
      return rejectWithValue(error.message || 'Failed to toggle warranty status');
    }
  }
);

const warrantySlice = createSlice({
  name: 'warranties',
  initialState: {
    warranties: [],
    filteredWarranties: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      if (!action.payload.trim()) {
        state.filteredWarranties = state.warranties;
      } else {
        state.filteredWarranties = state.warranties.filter(warranty =>
          warranty.duration.toLowerCase().includes(action.payload.toLowerCase()) ||
          warranty.type.toLowerCase().includes(action.payload.toLowerCase()) ||
          warranty.description?.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
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
      // Fetch warranties
      .addCase(fetchWarranties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarranties.fulfilled, (state, action) => {
        state.loading = false;
        state.warranties = action.payload;
        if (state.searchTerm.trim()) {
          state.filteredWarranties = action.payload.filter(warranty =>
            warranty.duration.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredWarranties = action.payload;
        }
      })
      .addCase(fetchWarranties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create warranty
      .addCase(createWarranty.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWarranty.fulfilled, (state, action) => {
        state.loading = false;
        state.warranties.push(action.payload);
        if (state.searchTerm.trim()) {
          state.filteredWarranties = state.warranties.filter(warranty =>
            warranty.duration.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredWarranties = state.warranties;
        }
        state.notification = { message: 'Warranty created successfully!', type: 'success' };
      })
      .addCase(createWarranty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update warranty
      .addCase(updateWarranty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWarranty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.warranties.findIndex(w => w._id === action.payload._id);
        if (index !== -1) {
          state.warranties[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredWarranties = state.warranties.filter(warranty =>
            warranty.duration.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredWarranties = state.warranties;
        }
        state.notification = { message: 'Warranty updated successfully!', type: 'success' };
      })
      .addCase(updateWarranty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete warranty
      .addCase(deleteWarranty.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWarranty.fulfilled, (state, action) => {
        state.loading = false;
        state.warranties = state.warranties.filter(w => w._id !== action.payload);
        if (state.searchTerm.trim()) {
          state.filteredWarranties = state.warranties.filter(warranty =>
            warranty.duration.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredWarranties = state.warranties;
        }
        state.notification = { message: 'Warranty deleted successfully!', type: 'success' };
      })
      .addCase(deleteWarranty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleWarrantyStatus.fulfilled, (state, action) => {
        const index = state.warranties.findIndex(w => w._id === action.payload._id);
        if (index !== -1) {
          state.warranties[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredWarranties = state.warranties.filter(warranty =>
            warranty.duration.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            warranty.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredWarranties = state.warranties;
        }
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Warranty ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleWarrantyStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = warrantySlice.actions;
export default warrantySlice.reducer;