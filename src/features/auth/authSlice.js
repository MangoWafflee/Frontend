import { createSlice } from "@reduxjs/toolkit";

// 초기값
const initialState={
    status:'idle',
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
    // Thunks 파일에 있는 비동기에 관한 처리
    // extraReducers:{

    // }
  });
  
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// 상태 선택자 정의
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn; // 로그인 여부
export const selectCurrentUser = (state) => state.auth.user; // 유저 정보
export const selectAuthError = (state) => state.auth.error; // 에러 정보

export default authSlice.reducer;