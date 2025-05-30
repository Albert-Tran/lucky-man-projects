// src/services/api/userApi.js
import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';

const userApi = {
  /**
   * Gọi API để thay đổi mật khẩu người dùng.
   * @param {string} oldPassword - Mật khẩu cũ.
   * @param {string} newPassword - Mật khẩu mới.
   * @returns {Promise<Object>} Dữ liệu phản hồi từ API.
   * @throws {Error} Ném lỗi nếu đổi mật khẩu không thành công.
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await httpClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
      });
      if (response?.data?.success) {
        return response?.data?.data;
      } else {
        throw new Error(response?.data?.message || 'Đổi mật khẩu không thành công.');
      }
    } catch (error) {
      // Axios error.response.data chứa lỗi từ server
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi đổi mật khẩu.';
      throw new Error(errorMessage);
    }
  },
};

export default userApi;