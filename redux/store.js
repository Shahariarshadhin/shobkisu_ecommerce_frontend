import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import brandReducer from "./brandSlice";
import modelReducer from "./modelSlice";
import colorReducer from "./colorSlice";
import storageReducer from "./storageSlice";
import simReducer from "./simSlice";

export const store = configureStore({
  reducer: { 
    cart: cartReducer, 
    auth: authReducer,
    brands: brandReducer,
    models: modelReducer,
    colors: colorReducer,
    storage: storageReducer,
    sims: simReducer,
  },
});
