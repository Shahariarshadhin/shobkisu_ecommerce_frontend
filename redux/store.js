import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import brandReducer from "./brandSlice";
import modelReducer from "./modelSlice";
import colorReducer from "./colorSlice";
import storageReducer from "./storageSlice";
import simReducer from "./simSlice";
import deviceConditionReducer from "./deviceConditionSlice";
import warrantyReducer from "./warrantySlice";
import productReducer from "./productSlice";
import uiReducer from './uiSlice';
import orderReducer from './orderSlice';
import flagReducer from './flagSlice';

export const store = configureStore({
  reducer: { 
    cart: cartReducer, 
    auth: authReducer,
    brands: brandReducer,
    models: modelReducer,
    colors: colorReducer,
    storage: storageReducer,
    sims: simReducer,
    deviceConditions: deviceConditionReducer,
    warranties: warrantyReducer,
    flags: flagReducer,
    products: productReducer,
     ui: uiReducer,
     orders: orderReducer,
  },
});
