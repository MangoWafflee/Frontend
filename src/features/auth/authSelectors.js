export const selectIsLoggedIn = (state) => state.auth.isLoggedIn; // 로그인 여부
export const selectCurrentUser = (state) => state.auth.user; // 유저 정보
export const selectAuthError = (state) => state.auth.error; // 에러 정보
