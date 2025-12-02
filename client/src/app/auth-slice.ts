import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Auth, { UserInfo } from "../types/Auth";

const initialState: Auth = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")!) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (auth, action: PayloadAction<UserInfo>) => {
      auth.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    clearCredentials: (auth) => {
      auth.userInfo = undefined;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice;
