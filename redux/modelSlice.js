import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/models`;

// Async thunks
export const fetchModels = createAsyncThunk(
  'models/fetchModels',
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
      return rejectWithValue(error.message || 'Failed to fetch models');
    }
  }
);

// Helper function to fetch a single model with populated brand
export const fetchModelById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch model:', error);
    return null;
  }
};

export const createModel = createAsyncThunk(
  'models/createModel',
  async (modelData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        // Fetch the created model with populated brand
        const populatedModel = await fetchModelById(data.data._id);
        return populatedModel || data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create model');
    }
  }
);

export const updateModel = createAsyncThunk(
  'models/updateModel',
  async ({ id, modelData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        // Fetch the updated model with populated brand
        const populatedModel = await fetchModelById(id);
        return populatedModel || data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update model');
    }
  }
);

export const deleteModel = createAsyncThunk(
  'models/deleteModel',
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
      return rejectWithValue(error.message || 'Failed to delete model');
    }
  }
);

export const toggleModelStatus = createAsyncThunk(
  'models/toggleModelStatus',
  async (model, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${model._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...model, isActive: !model.isActive })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        // Fetch the updated model with populated brand
        const populatedModel = await fetchModelById(model._id);
        return populatedModel || data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle model status');
    }
  }
);

const modelSlice = createSlice({
  name: 'models',
  initialState: {
    models: [],
    filteredModels: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredModels = state.models.filter(model =>
        model.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        model.brandId?.name.toLowerCase().includes(action.payload.toLowerCase())
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
      // Fetch models
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
        state.filteredModels = action.payload.filter(model =>
          model.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          model.brandId?.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create model
      .addCase(createModel.pending, (state) => {
        state.loading = true;
      })
      .addCase(createModel.fulfilled, (state, action) => {
        state.loading = false;
        state.models.push(action.payload);
        state.filteredModels = state.models.filter(model =>
          model.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          model.brandId?.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Model created successfully!', type: 'success' };
      })
      .addCase(createModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update model
      .addCase(updateModel.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateModel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.models.findIndex(m => m._id === action.payload._id);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
        state.filteredModels = state.models.filter(model =>
          model.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          model.brandId?.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Model updated successfully!', type: 'success' };
      })
      .addCase(updateModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete model
      .addCase(deleteModel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.loading = false;
        state.models = state.models.filter(m => m._id !== action.payload);
        state.filteredModels = state.models.filter(model =>
          model.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          model.brandId?.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Model deleted successfully!', type: 'success' };
      })
      .addCase(deleteModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleModelStatus.fulfilled, (state, action) => {
        const index = state.models.findIndex(m => m._id === action.payload._id);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
        state.filteredModels = state.models.filter(model =>
          model.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          model.brandId?.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Model ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleModelStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = modelSlice.actions;
export default modelSlice.reducer;