export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.76.45.112:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/email',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me'
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CHANGE_PASSWORD: '/api/auth/change-password'
  },
  TOKEN: {
    CREATE: '/tokens/create',
    DELETE: '/tokens/delete',
    LIST: '/tokens',
    DETAIL: '/tokens/:address'
  },
  WALLET: {
    WALLET_GROUP_MANAGER: '/groups'
  }
};
