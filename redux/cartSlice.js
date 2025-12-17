import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i._id === item._id);
      
      if (existing) {
        if (existing.quantity < item.stock) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(i => i._id !== id);
    },
    incrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;