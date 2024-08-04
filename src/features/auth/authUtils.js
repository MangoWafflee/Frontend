// src/utils/authUtils.js

import { login } from './authSlice';

export const loadUserFromLocalStorage = (dispatch) => {
  const storedUser = JSON.parse(
    localStorage.getItem('user')
  );
  const storedToken = localStorage.getItem('token');
  if (storedUser && storedToken) {
    dispatch(
      login({ user: storedUser, token: storedToken })
    );
  }
};
