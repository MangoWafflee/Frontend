import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isLoggedIn: false,
    user: null,
    token: null,
    error: null,
  };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginStart(state) {
        state.error = null;
      },
      // 로그인 성공 시
      loginSuccess(state, action) {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      },
      // 로그인 실패 시
      loginFailure(state, action) {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.error = action.payload.error;
      },
      // 로그 아웃
      logout(state) {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.error = null;
      },
    },
  });
  
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;