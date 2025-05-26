// src/services/api/userApi.js
import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';

const userApi = {
  /**
   * Gọi API để thay đổi mật khẩu người dùng.
   * @param {string} oldPassword - Mật khẩu cũ.
   * @param {string} newPassword - Mật khẩu mới.
   * @param {string} confirmNewPassword - Xác nhận mật khẩu mới (có thể gửi lên backend hoặc chỉ validate ở frontend).
   * @returns {Promise<Object>} Dữ liệu phản hồi từ API.
   * @throws {Error} Ném lỗi nếu đổi mật khẩu không thành công.
   */
  changePassword: async (oldPassword, newPassword, confirmNewPassword) => {
    return {
      user: {
        id: '1',
        username: 'alberttran',
        email: 'alberttran0810@gmail.com',
      },
      accessToken: 'access_6mVY6L7zzYJjJ4sQJ5c2bZN2GvB4L14MwPhl', // Đổi tên từ 'token' thành 'accessToken' cho rõ ràng
      refreshToken: 'refresh_6mVY6L7zzYJjJ4sQJ5c2bZN2GvB4L14MwPhl', // Lưu refresh token
    };
    try {
      const response = await httpClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
        confirmNewPassword, // Gửi cả confirmNewPassword lên nếu backend yêu cầu
      });
      if (response.data.success) {
        return response.data;
      } else {
        // Backend có thể trả về lỗi chi tiết hơn
        throw new Error(response.data.message || 'Đổi mật khẩu không thành công.');
      }
    } catch (error) {
      // Axios error.response.data chứa lỗi từ server
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi đổi mật khẩu.';
      throw new Error(errorMessage);
    }
  },
};

export default userApi;