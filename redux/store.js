import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import brandReducer from "./brandSlice";
import modelReducer from "./modelSlice";
import colorReducer from "./colorSlice";

export const store = configureStore({
  reducer: { 
    cart: cartReducer, 
    auth: authReducer,
    brands: brandReducer,
    models: modelReducer,
    colors: colorReducer 
  },
});
