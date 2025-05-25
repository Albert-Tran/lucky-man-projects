import httpClient from '../http/httpClient';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';

const authApi = {
  // Login
  login: async (username, password) => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, {username, password});
      if (response.data.success) {
        return response.data;
      } else {
        // Backend có thể trả về lỗi chi tiết hơn
        throw new Error(response.data.message || 'Login không thành công.');
      }
    } catch (error) {
      // Axios error.response.data chứa lỗi từ server
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi login.';
      throw new Error(errorMessage);
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Logout không thành công.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi Logout.';
      throw new Error(errorMessage);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.ME);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Lấy thông tin người dùng không thành công.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
      throw new Error(errorMessage);
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      });
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Cập nhật refresh token không thành công.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi cập nhật refresh token.';
      throw new Error(errorMessage);
    }
  }
};

export default authApi;
