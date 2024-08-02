import { createSlice } from "@reduxjs/toolkit";

// 초기값
const initialState = {
	isLoggedIn: false,
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.user = null;
			state.token = null;
		},
		updateProfile: (state, action) => {
			if (state.user) {
				state.user = { ...state.user, ...action.payload };
			}
		},
	},
});

export const { login, logout, updateProfile } = authSlice.actions;

// 상태 선택자 정의
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn; // 로그인 여부
export const selectUser = (state) => state.auth.user; // 유저 정보
export const selectToken = (state) => state.auth.token; // 토큰 정보

export default authSlice.reducer;
