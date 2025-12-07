import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import brandReducer from "./brandSlice";

export const store = configureStore({
  reducer: { 
    cart: cartReducer, 
    auth: authReducer,
    brands: brandReducer 
  },
});
