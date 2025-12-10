import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/sims`;

// Async thunks
export const fetchSims = createAsyncThunk(
  'sims/fetchSims',
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
      return rejectWithValue(error.message || 'Failed to fetch SIMs');
    }
  }
);

export const createSim = createAsyncThunk(
  'sims/createSim',
  async (simData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simData)
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
      return rejectWithValue(error.message || 'Failed to create SIM');
    }
  }
);

export const updateSim = createAsyncThunk(
  'sims/updateSim',
  async ({ id, simData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simData)
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
      return rejectWithValue(error.message || 'Failed to update SIM');
    }
  }
);

export const deleteSim = createAsyncThunk(
  'sims/deleteSim',
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
      return rejectWithValue(error.message || 'Failed to delete SIM');
    }
  }
);

export const toggleSimStatus = createAsyncThunk(
  'sims/toggleSimStatus',
  async (sim, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${sim._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sim, isActive: !sim.isActive })
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
      return rejectWithValue(error.message || 'Failed to toggle SIM status');
    }
  }
);

const simSlice = createSlice({
  name: 'sims',
  initialState: {
    sims: [],
    filteredSims: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      if (!action.payload.trim()) {
        state.filteredSims = state.sims;
      } else {
        state.filteredSims = state.sims.filter(sim =>
          sim.type.toLowerCase().includes(action.payload.toLowerCase()) ||
          sim.description?.toLowerCase().includes(action.payload.toLowerCase())
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
      // Fetch sims
      .addCase(fetchSims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSims.fulfilled, (state, action) => {
        state.loading = false;
        state.sims = action.payload;
        if (state.searchTerm.trim()) {
          state.filteredSims = action.payload.filter(sim =>
            sim.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            sim.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredSims = action.payload;
        }
      })
      .addCase(fetchSims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create sim
      .addCase(createSim.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSim.fulfilled, (state, action) => {
        state.loading = false;
        state.sims.push(action.payload);
        if (state.searchTerm.trim()) {
          state.filteredSims = state.sims.filter(sim =>
            sim.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            sim.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredSims = state.sims;
        }
        state.notification = { message: 'SIM created successfully!', type: 'success' };
      })
      .addCase(createSim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update sim
      .addCase(updateSim.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSim.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sims.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.sims[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredSims = state.sims.filter(sim =>
            sim.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            sim.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredSims = state.sims;
        }
        state.notification = { message: 'SIM updated successfully!', type: 'success' };
      })
      .addCase(updateSim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete sim
      .addCase(deleteSim.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSim.fulfilled, (state, action) => {
        state.loading = false;
        state.sims = state.sims.filter(s => s._id !== action.payload);
        if (state.searchTerm.trim()) {
          state.filteredSims = state.sims.filter(sim =>
            sim.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            sim.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredSims = state.sims;
        }
        state.notification = { message: 'SIM deleted successfully!', type: 'success' };
      })
      .addCase(deleteSim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleSimStatus.fulfilled, (state, action) => {
        const index = state.sims.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.sims[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredSims = state.sims.filter(sim =>
            sim.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            sim.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredSims = state.sims;
        }
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `SIM ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleSimStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = simSlice.actions;
export default simSlice.reducer;