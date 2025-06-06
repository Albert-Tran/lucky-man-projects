/**
 * Chuyển đổi một chuỗi ngày giờ UTC sang múi giờ mong muốn và định dạng.
 *
 * @param {string} utcDateString - Chuỗi ngày giờ UTC (ví dụ: '2025-06-01T16:34:54.113Z').
 * @param {string} targetTimezone - Múi giờ đích (ví dụ: 'Asia/Ho_Chi_Minh' cho Việt Nam, 'America/New_York', 'Europe/London').
 * @param {Object} options - Tùy chọn định dạng cho Intl.DateTimeFormat (ví dụ: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).
 * @returns {string} Chuỗi ngày giờ đã được chuyển đổi và định dạng.
 */
export const convertUtcToTimezone = (utcDateString, targetTimezone, options = {}) => {
  if (!utcDateString) {
    return '';
  }

  const date = new Date(utcDateString);

  // Đặt các tùy chọn mặc định nếu không được cung cấp
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23', // Để đảm bảo định dạng 24 giờ, dùng 'h24' hoặc 'h23'
    timeZone: targetTimezone,
  };

  const finalOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat('vi-VN', finalOptions).format(date);
};

/**
 * Định dạng một chuỗi ngày giờ UTC sang giờ Việt Nam mặc định.
 *
 * @param {string} utcDateString - Chuỗi ngày giờ UTC.
 * @returns {string} Chuỗi ngày giờ Việt Nam đã định dạng.
 */
export const formatToVietnamTime = (utcDateString) => {
  return convertUtcToTimezone(utcDateString, 'Asia/Ho_Chi_Minh', {
    hour12: false, // Sử dụng định dạng 24 giờ
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};