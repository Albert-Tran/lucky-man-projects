/**
 * Kiểm tra xem một trường có rỗng hay không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {string} fieldName - Tên trường để tạo thông báo lỗi cụ thể.
 * @returns {string|null} Chuỗi lỗi nếu rỗng, hoặc null nếu hợp lệ.
 */
export const validateRequired = (value, fieldName = 'Trường này') => {
  if (!value || String(value).trim() === '') {
    return `${fieldName} không được để trống.`;
  }
  return null;
};

/**
 * Kiểm tra độ dài tối thiểu của một trường chuỗi.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {number} minLength - Độ dài tối thiểu.
 * @param {string} fieldName - Tên trường.
 * @returns {string|null} Chuỗi lỗi nếu không đạt độ dài tối thiểu, hoặc null nếu hợp lệ.
 */
export const validateMinLength = (value, minLength, fieldName = 'Trường này') => {
  if (value && value.length < minLength) {
    return `${fieldName} phải có ít nhất ${minLength} ký tự.`;
  }
  return null;
};

/**
 * Kiểm tra độ dài tối đa của một trường chuỗi.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {number} maxLength - Độ dài tối đa.
 * @param {string} fieldName - Tên trường.
 * @returns {string|null} Chuỗi lỗi nếu vượt quá độ dài tối đa, hoặc null nếu hợp lệ.
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Trường này') => {
  if (value && value.length > maxLength) {
    return `${fieldName} không được vượt quá ${maxLength} ký tự.`;
  }
  return null;
};

/**
 * Kiểm tra định dạng email hợp lệ.
 * @param {string} email - Giá trị email cần kiểm tra.
 * @returns {string|null} Chuỗi lỗi nếu không phải định dạng email, hoặc null nếu hợp lệ.
 */
export const validateEmail = (email) => {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Email không hợp lệ.';
  }
  return null;
};

/**
 * Kiểm tra xem hai giá trị có khớp nhau không (ví dụ: mật khẩu và xác nhận mật khẩu).
 * @param {string} value - Giá trị đầu tiên.
 * @param {string} compareValue - Giá trị thứ hai để so sánh.
 * @param {string} fieldName - Tên trường.
 * @returns {string|null} Chuỗi lỗi nếu không khớp, hoặc null nếu hợp lệ.
 */
export const validateMatch = (value, compareValue, fieldName = 'Giá trị này') => {
  if (value && compareValue && value !== compareValue) {
    return `${fieldName} không khớp.`;
  }
  return null;
};

/**
 * Kiểm tra xem giá trị có phải là số hay không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {string} fieldName - Tên trường.
 * @returns {string|null} Chuỗi lỗi nếu không phải số, hoặc null nếu hợp lệ.
 */
export const validateNumber = (value, fieldName = 'Trường này') => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} phải là một số.`;
  }
  return null;
};

/**
 * Kiểm tra xem giá trị có lớn hơn một số nhất định hay không.
 * @param {number|string} value - Giá trị cần kiểm tra.
 * @param {number} minValue - Giá trị tối thiểu.
 * @param {string} fieldName - Tên trường.
 * @returns {string|null} Chuỗi lỗi nếu không lớn hơn minValue, hoặc null nếu hợp lệ.
 */
export const validateMin = (value, minValue, fieldName = 'Trường này') => {
  const numValue = Number(value);
  if (!isNaN(numValue) && numValue < minValue) {
    return `${fieldName} phải lớn hơn hoặc bằng ${minValue}.`;
  }
  return null;
};

export const composeValidators = (...validators) => (value, fieldName, allValues = {}) => {
  for (let validator of validators) {
    // Truyền thêm allValues để validator có thể truy cập các trường khác (ví dụ: confirmPassword)
    const error = validator(value, fieldName, allValues);
    if (error) {
      return error;
    }
  }
  return null;
};