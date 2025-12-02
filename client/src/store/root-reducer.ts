import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../app/auth-slice";
import cartSlice from "../app/cart-slice";
import apiSlice from "./api-slice";

const reducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [cartSlice.name]: cartSlice.reducer,
  [authSlice.name]: authSlice.reducer,
});

export default reducer;
