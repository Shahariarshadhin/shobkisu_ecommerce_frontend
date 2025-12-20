// store/flagSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/flags`;

// Async thunks
export const fetchFlags = createAsyncThunk(
  'flags/fetchFlags',
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
      return rejectWithValue(error.message || 'Failed to fetch flags');
    }
  }
);

export const createFlag = createAsyncThunk(
  'flags/createFlag',
  async (flagData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flagData)
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
      return rejectWithValue(error.message || 'Failed to create flag');
    }
  }
);

export const updateFlag = createAsyncThunk(
  'flags/updateFlag',
  async ({ id, flagData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flagData)
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
      return rejectWithValue(error.message || 'Failed to update flag');
    }
  }
);

export const deleteFlag = createAsyncThunk(
  'flags/deleteFlag',
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
      return rejectWithValue(error.message || 'Failed to delete flag');
    }
  }
);

export const toggleFlagStatus = createAsyncThunk(
  'flags/toggleFlagStatus',
  async (flag, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${flag._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...flag, isActive: !flag.isActive })
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
      return rejectWithValue(error.message || 'Failed to toggle flag status');
    }
  }
);

const flagSlice = createSlice({
  name: 'flags',
  initialState: {
    flags: [],
    filteredFlags: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      if (!action.payload.trim()) {
        state.filteredFlags = state.flags;
      } else {
        state.filteredFlags = state.flags.filter(flag =>
          flag.type.toLowerCase().includes(action.payload.toLowerCase()) ||
          flag.description?.toLowerCase().includes(action.payload.toLowerCase())
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
      // Fetch flags
      .addCase(fetchFlags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlags.fulfilled, (state, action) => {
        state.loading = false;
        state.flags = action.payload;
        if (state.searchTerm.trim()) {
          state.filteredFlags = action.payload.filter(flag =>
            flag.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            flag.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredFlags = action.payload;
        }
      })
      .addCase(fetchFlags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create flag
      .addCase(createFlag.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFlag.fulfilled, (state, action) => {
        state.loading = false;
        state.flags.push(action.payload);
        if (state.searchTerm.trim()) {
          state.filteredFlags = state.flags.filter(flag =>
            flag.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            flag.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredFlags = state.flags;
        }
        state.notification = { message: 'Flag created successfully!', type: 'success' };
      })
      .addCase(createFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update flag
      .addCase(updateFlag.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFlag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.flags.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.flags[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredFlags = state.flags.filter(flag =>
            flag.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            flag.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredFlags = state.flags;
        }
        state.notification = { message: 'Flag updated successfully!', type: 'success' };
      })
      .addCase(updateFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete flag
      .addCase(deleteFlag.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFlag.fulfilled, (state, action) => {
        state.loading = false;
        state.flags = state.flags.filter(f => f._id !== action.payload);
        if (state.searchTerm.trim()) {
          state.filteredFlags = state.flags.filter(flag =>
            flag.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            flag.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredFlags = state.flags;
        }
        state.notification = { message: 'Flag deleted successfully!', type: 'success' };
      })
      .addCase(deleteFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleFlagStatus.fulfilled, (state, action) => {
        const index = state.flags.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.flags[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredFlags = state.flags.filter(flag =>
            flag.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            flag.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredFlags = state.flags;
        }
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Flag ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleFlagStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = flagSlice.actions;
export default flagSlice.reducer;