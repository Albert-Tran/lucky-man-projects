export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id'
  }
};
