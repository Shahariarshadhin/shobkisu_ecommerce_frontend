import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/device-conditions`;

// Async thunks
export const fetchDeviceConditions = createAsyncThunk(
  'deviceConditions/fetchDeviceConditions',
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
      return rejectWithValue(error.message || 'Failed to fetch device conditions');
    }
  }
);

export const createDeviceCondition = createAsyncThunk(
  'deviceConditions/createDeviceCondition',
  async (conditionData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conditionData)
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
      return rejectWithValue(error.message || 'Failed to create device condition');
    }
  }
);

export const updateDeviceCondition = createAsyncThunk(
  'deviceConditions/updateDeviceCondition',
  async ({ id, conditionData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conditionData)
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
      return rejectWithValue(error.message || 'Failed to update device condition');
    }
  }
);

export const deleteDeviceCondition = createAsyncThunk(
  'deviceConditions/deleteDeviceCondition',
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
      return rejectWithValue(error.message || 'Failed to delete device condition');
    }
  }
);

export const toggleDeviceConditionStatus = createAsyncThunk(
  'deviceConditions/toggleDeviceConditionStatus',
  async (condition, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${condition._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...condition, isActive: !condition.isActive })
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
      return rejectWithValue(error.message || 'Failed to toggle device condition status');
    }
  }
);

const deviceConditionSlice = createSlice({
  name: 'deviceConditions',
  initialState: {
    conditions: [],
    filteredConditions: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      if (!action.payload.trim()) {
        state.filteredConditions = state.conditions;
      } else {
        state.filteredConditions = state.conditions.filter(condition =>
          condition.condition.toLowerCase().includes(action.payload.toLowerCase()) ||
          condition.description?.toLowerCase().includes(action.payload.toLowerCase())
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
      // Fetch device conditions
      .addCase(fetchDeviceConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.conditions = action.payload;
        if (state.searchTerm.trim()) {
          state.filteredConditions = action.payload.filter(condition =>
            condition.condition.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            condition.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredConditions = action.payload;
        }
      })
      .addCase(fetchDeviceConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create device condition
      .addCase(createDeviceCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDeviceCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.conditions.push(action.payload);
        if (state.searchTerm.trim()) {
          state.filteredConditions = state.conditions.filter(condition =>
            condition.condition.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            condition.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredConditions = state.conditions;
        }
        state.notification = { message: 'Device condition created successfully!', type: 'success' };
      })
      .addCase(createDeviceCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update device condition
      .addCase(updateDeviceCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDeviceCondition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.conditions.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.conditions[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredConditions = state.conditions.filter(condition =>
            condition.condition.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            condition.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredConditions = state.conditions;
        }
        state.notification = { message: 'Device condition updated successfully!', type: 'success' };
      })
      .addCase(updateDeviceCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete device condition
      .addCase(deleteDeviceCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDeviceCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.conditions = state.conditions.filter(c => c._id !== action.payload);
        if (state.searchTerm.trim()) {
          state.filteredConditions = state.conditions.filter(condition =>
            condition.condition.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            condition.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredConditions = state.conditions;
        }
        state.notification = { message: 'Device condition deleted successfully!', type: 'success' };
      })
      .addCase(deleteDeviceCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleDeviceConditionStatus.fulfilled, (state, action) => {
        const index = state.conditions.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.conditions[index] = action.payload;
        }
        if (state.searchTerm.trim()) {
          state.filteredConditions = state.conditions.filter(condition =>
            condition.condition.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            condition.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else {
          state.filteredConditions = state.conditions;
        }
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Device condition ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleDeviceConditionStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = deviceConditionSlice.actions;
export default deviceConditionSlice.reducer;