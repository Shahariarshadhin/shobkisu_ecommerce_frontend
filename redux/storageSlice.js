import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_API_URL}/storages`;

console.log('🌐 API URL configured as:', API_URL);

// Helper function to filter storage
const filterStorage = (storage, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return storage;
  }
  const term = searchTerm.toLowerCase();
  return storage.filter(
    (item) =>
      item.ram.toLowerCase().includes(term) ||
      item.rom.toLowerCase().includes(term)
  );
};

// Async thunks
export const fetchStorage = createAsyncThunk(
  "storage/fetchStorage",
  async (_, { rejectWithValue }) => {
    try {
    //   console.log('📡 Fetching storage from:', API_URL);
      const response = await fetch(API_URL);
      
    //   console.log('📡 Response status:', response.status);
    //   console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    //   console.log('📡 Response data:', data);
      
      if (data.success) {
        // console.log('✅ Storage data retrieved:', data.data);
        return data.data;
      }
      
      console.error('❌ API returned success: false', data.message);
      return rejectWithValue(data.message);
    } catch (error) {
      console.error('❌ Fetch storage error:', error);
      return rejectWithValue(error.message || "Failed to fetch storage");
    }
  }
);

export const createStorage = createAsyncThunk(
  "storage/createStorage",
  async (storageData, { rejectWithValue }) => {
    try {
      console.log('📤 Creating storage:', storageData);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storageData),
      });
      
      console.log('📤 Create response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📤 Create response data:', data);
      
      if (data.success) {
        console.log('✅ Storage created:', data.data);
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      console.error('❌ Create storage error:', error);
      return rejectWithValue(error.message || "Failed to create storage");
    }
  }
);

export const updateStorage = createAsyncThunk(
  "storage/updateStorage",
  async ({ id, storageData }, { rejectWithValue }) => {
    try {
      console.log('📝 Updating storage:', id, storageData);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storageData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        console.log('✅ Storage updated:', data.data);
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      console.error('❌ Update storage error:', error);
      return rejectWithValue(error.message || "Failed to update storage");
    }
  }
);

export const deleteStorage = createAsyncThunk(
  "storage/deleteStorage",
  async (id, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting storage:', id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        console.log('✅ Storage deleted:', id);
        return id;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      console.error('❌ Delete storage error:', error);
      return rejectWithValue(error.message || "Failed to delete storage");
    }
  }
);

export const toggleStorageStatus = createAsyncThunk(
  "storage/toggleStorageStatus",
  async (storage, { rejectWithValue }) => {
    try {
      console.log('🔄 Toggling storage status:', storage._id);
      const response = await fetch(`${API_URL}/${storage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...storage, isActive: !storage.isActive }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        console.log('✅ Storage status toggled:', data.data);
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      console.error('❌ Toggle status error:', error);
      return rejectWithValue(
        error.message || "Failed to toggle storage status"
      );
    }
  }
);

const storageSlice = createSlice({
  name: "storage",
  initialState: {
    storage: [],
    filteredStorage: [],
    searchTerm: "",
    loading: false,
    error: null,
    notification: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredStorage = filterStorage(state.storage, action.payload);
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch storage
      .addCase(fetchStorage.pending, (state) => {
        // console.log('⏳ Fetch storage pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStorage.fulfilled, (state, action) => {
        // console.log('✅ Fetch storage fulfilled with:', action.payload);
        state.loading = false;
        state.storage = action.payload;
        state.filteredStorage = filterStorage(action.payload, state.searchTerm);
        // console.log('✅ State updated - storage count:', state.storage.length);
      })
      .addCase(fetchStorage.rejected, (state, action) => {
        console.error('❌ Fetch storage rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: "error" };
      })
      // Create storage
      .addCase(createStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStorage.fulfilled, (state, action) => {
        console.log('✅ Create storage fulfilled, adding to state:', action.payload);
        state.loading = false;
        state.storage.push(action.payload);
        state.filteredStorage = filterStorage(state.storage, state.searchTerm);
        console.log('✅ State updated - storage count:', state.storage.length);
        state.notification = {
          message: "Storage created successfully!",
          type: "success",
        };
      })
      .addCase(createStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: "error" };
      })
      // Update storage
      .addCase(updateStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStorage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.storage.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.storage[index] = action.payload;
        }
        state.filteredStorage = filterStorage(state.storage, state.searchTerm);
        state.notification = {
          message: "Storage updated successfully!",
          type: "success",
        };
      })
      .addCase(updateStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: "error" };
      })
      // Delete storage
      .addCase(deleteStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.storage = state.storage.filter((s) => s._id !== action.payload);
        state.filteredStorage = filterStorage(state.storage, state.searchTerm);
        state.notification = {
          message: "Storage deleted successfully!",
          type: "success",
        };
      })
      .addCase(deleteStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: "error" };
      })
      // Toggle status
      .addCase(toggleStorageStatus.fulfilled, (state, action) => {
        const index = state.storage.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.storage[index] = action.payload;
        }
        state.filteredStorage = filterStorage(state.storage, state.searchTerm);
        const statusText = action.payload.isActive
          ? "activated"
          : "deactivated";
        state.notification = {
          message: `Storage ${statusText} successfully!`,
          type: "success",
        };
      })
      .addCase(toggleStorageStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: "error" };
      });
  },
});

export const { setSearchTerm, setNotification, clearNotification, clearError } =
  storageSlice.actions;
export default storageSlice.reducer;