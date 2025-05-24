import httpClient from '../http/httpClient';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';

const authApi = {
  // Login
  login: async (credentials) => {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await httpClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await httpClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken
    });
    return response.data;
  }
};

export default authApi;
