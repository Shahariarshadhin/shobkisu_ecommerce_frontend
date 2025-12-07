import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fix: Ensure proper API URL construction
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_API_URL}/brands`;

// Async thunks
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
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
      return rejectWithValue(error.message || 'Failed to fetch brands');
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
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
      return rejectWithValue(error.message || 'Failed to create brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
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
      return rejectWithValue(error.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
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
        // Return the ID so we can filter it out from the state
        return id;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete brand');
    }
  }
);

export const toggleBrandStatus = createAsyncThunk(
  'brands/toggleBrandStatus',
  async (brand, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${brand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, isActive: !brand.isActive })
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
      return rejectWithValue(error.message || 'Failed to toggle brand status');
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    filteredBrands: [],
    searchTerm: '',
    loading: false,
    error: null,
    notification: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredBrands = state.brands.filter(brand =>
        brand.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        brand.description?.toLowerCase().includes(action.payload.toLowerCase())
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
      // Fetch brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        state.filteredBrands = action.payload.filter(brand =>
          brand.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Create brand
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
        state.filteredBrands = state.brands.filter(brand =>
          brand.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Brand created successfully!', type: 'success' };
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Update brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        state.filteredBrands = state.brands.filter(brand =>
          brand.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Brand updated successfully!', type: 'success' };
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the brand from both arrays
        state.brands = state.brands.filter(b => b._id !== action.payload);
        state.filteredBrands = state.brands.filter(brand =>
          brand.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        state.notification = { message: 'Brand deleted successfully!', type: 'success' };
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      })
      // Toggle status
      .addCase(toggleBrandStatus.fulfilled, (state, action) => {
        const index = state.brands.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        state.filteredBrands = state.brands.filter(brand =>
          brand.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          brand.description?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
        const statusText = action.payload.isActive ? 'activated' : 'deactivated';
        state.notification = { 
          message: `Brand ${statusText} successfully!`, 
          type: 'success' 
        };
      })
      .addCase(toggleBrandStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.notification = { message: action.payload, type: 'error' };
      });
  }
});

export const { setSearchTerm, setNotification, clearNotification, clearError } = brandSlice.actions;
export default brandSlice.reducer;