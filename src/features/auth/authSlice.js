import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // 로컬 스토리지에 유저 정보와 토큰 저장
      localStorage.setItem(
        'user',
        JSON.stringify(action.payload.user)
      );
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      // 로컬 스토리지에서 유저 정보와 토큰 제거
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // 로컬 스토리지에 업데이트된 유저 정보 저장
        localStorage.setItem(
          'user',
          JSON.stringify(state.user)
        );
      }
    },
  },
});

export const { login, logout, updateProfile } =
  authSlice.actions;

export const selectIsLoggedIn = (state) =>
  state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
