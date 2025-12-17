import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`/api/orders?${queryParams}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (orderId) => {
    const response = await fetch(`/api/orders/${orderId}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, statusData }) => {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePayment',
  async ({ orderId, paymentStatus }) => {
    const response = await fetch(`/api/orders/${orderId}/payment-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async ({ orderId, cancelReason }) => {
    const response = await fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancelReason })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
);

export const fetchOrderStatistics = createAsyncThunk(
  'orders/fetchStatistics',
  async () => {
    const response = await fetch('/api/orders/statistics');
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    statistics: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      
      // Update Payment Status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      
      // Fetch Statistics
      .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  }
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;