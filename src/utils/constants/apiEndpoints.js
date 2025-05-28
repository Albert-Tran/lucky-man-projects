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
    DETAIL: '/users/:id',
    CHANGE_PASSWORD: '/users/change-password'
  },
  TOKEN: {
    CREATE: '/tokens/create',
    DELETE: '/tokens/delete',
    LIST: '/tokens',
    DETAIL: '/tokens/:address'
  },
  WALLET: {
    WALLET_GROUP_MANAGER: 'wallet/group'
  }
};
