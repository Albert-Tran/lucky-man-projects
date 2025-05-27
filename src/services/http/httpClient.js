import axios from 'axios';
import { triggerLogout } from '../../utils/auth/authUtils.js';
import authApi from '../api/authApi.js'; // Import authApi để gọi refreshToken
import CONFIG from '../../utils/config/config.js';

const httpClient = axios.create({
  baseURL: CONFIG[import.meta.env.VITE_MODE].API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng đợi các request bị lỗi
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request Interceptor ---
httpClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Đổi tên từ user?.token thành user?.accessToken
    const accessToken = user?.accessToken;

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
httpClient.interceptors.response.use(
  (response) => response, // Trả về response thành công nguyên vẹn
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 Unauthorized VÀ không phải là yêu cầu refresh token VÀ không phải là yêu cầu đăng nhập
    if (error.response && error.response.status === 401 &&
        originalRequest.url !== `${API_BASE_URL}/refresh-token` &&
        originalRequest.url !== `${API_BASE_URL}/login` &&
        !originalRequest._retry) { // Cờ _retry để tránh vòng lặp vô hạn
      
      originalRequest._retry = true; // Đánh dấu request này đã được thử lại

      // Lấy refresh token hiện tại
      const user = JSON.parse(localStorage.getItem('user'));
      const refreshToken = user?.refreshToken;

      if (!refreshToken) {
        // Nếu không có refresh token, hoặc nó đã bị xóa, buộc người dùng đăng xuất
        console.warn('Refresh token not found. Logging out...');
        triggerLogout();
        return Promise.reject(error);
      }

      // Nếu chưa có quá trình làm mới token nào đang diễn ra
      if (!isRefreshing) {
        isRefreshing = true; // Bắt đầu quá trình làm mới
        console.log('Access Token expired. Attempting to refresh token...');
        try {
          // Gọi API làm mới token
          const refreshResponse = await authApi.refreshToken(refreshToken);
          const newAccessToken = refreshResponse.accessToken;
          const newRefreshToken = refreshResponse.refreshToken || refreshToken; // Cập nhật refresh token nếu có xoay vòng

          // Cập nhật Access Token và Refresh Token mới vào localStorage
          const updatedUser = { ...user, accessToken: newAccessToken, refreshToken: newRefreshToken };
          localStorage.setItem('user', JSON.stringify(updatedUser)); // Cập nhật localStorage trực tiếp

          // Đặt lại cờ và xử lý hàng đợi các request đang chờ
          isRefreshing = false;
          processQueue(null, newAccessToken); // Báo cho các request đang chờ biết token mới

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return httpClient(originalRequest)
        } catch (refreshError) {
          console.error('Failed to refresh token. Logging out...', refreshError);
          isRefreshing = false;
          processQueue(refreshError, null); // Báo cho các request đang chờ biết lỗi
          triggerLogout(); // Buộc người dùng đăng xuất
          return Promise.reject(refreshError); // Ném lỗi làm mới
        }
      } else {
        return new Promise(resolve => {
          failedQueue.push({ resolve, reject: (err) => Promise.reject(err) });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return httpClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;