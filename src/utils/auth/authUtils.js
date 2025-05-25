let onLogoutCallback = null;

/**
 * Đăng ký một hàm callback sẽ được gọi khi cần đăng xuất.
 * AuthContext sẽ gọi hàm này để đăng ký hàm logout của nó.
 * @param {Function} callback - Hàm logout từ AuthContext.
 */
export const registerLogoutCallback = (callback) => {
  onLogoutCallback = callback;
};

/**
 * Gọi hàm logout đã đăng ký.
 * httpClient sẽ gọi hàm này khi nhận được lỗi 401.
 */
export const triggerLogout = () => {
  if (onLogoutCallback) {
    onLogoutCallback();
  } else {
    // Fallback nếu chưa có callback nào được đăng ký (ví dụ: truy cập ngay sau khi load app)
    console.warn("Logout callback not registered. Clearing user from localStorage directly.");
    localStorage.removeItem('user'); // Vẫn là fallback an toàn
    window.location.href = '/login'; // Chuyển hướng
  }
};