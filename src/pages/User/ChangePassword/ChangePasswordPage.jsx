import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../../services/api/userApi.js';
import {
  validateRequired,
  validateMinLength,
  validateMatch,
  composeValidators
} from '../../../utils/helpers/validators.js';
import styles from './ChangePasswordPage.module.css';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // Validator cho mật khẩu cũ
  const validateOldPassword = composeValidators(
    (value) => validateRequired(value, 'Mật khẩu cũ')
  );

  // Validator cho mật khẩu mới
  const validateNewPassword = composeValidators(
    (value) => validateRequired(value, 'Mật khẩu mới'),
    (value) => validateMinLength(value, 1, 'Mật khẩu mới'), // Ví dụ min length 8
  );

  // Validator cho xác nhận mật khẩu mới
  const validateConfirmNewPassword = composeValidators(
    (value) => validateRequired(value, 'Xác nhận mật khẩu mới'),
    (value, fieldName, allValues) => validateMatch(value, allValues.newPassword, 'Mật khẩu xác nhận')
  );

  const validateForm = (formValues) => {
    let newErrors = {};

    const oldPasswordError = validateOldPassword(formValues.oldPassword);
    if (oldPasswordError) newErrors.oldPassword = oldPasswordError;

    const newPasswordError = validateNewPassword(formValues.newPassword);
    if (newPasswordError) newErrors.newPassword = newPasswordError;

    // Truyền tất cả formValues để validateMatch có thể so sánh newPassword
    const confirmNewPasswordError = validateConfirmNewPassword(formValues.confirmNewPassword, 'Xác nhận mật khẩu mới', formValues);
    if (confirmNewPasswordError) newErrors.confirmNewPassword = confirmNewPasswordError;

    // Thêm kiểm tra đặc biệt: Mật khẩu mới không được giống mật khẩu cũ
    if (!newErrors.newPassword && formValues.newPassword === formValues.oldPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được giống mật khẩu cũ.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi
    setApiError(''); // Reset lỗi API
    setSuccessMessage(''); // Reset thông báo thành công
    setLoading(true);

    const formValues = { oldPassword, newPassword, confirmNewPassword };
    const isValid = validateForm(formValues);

    if (isValid) {
      try {
        const response = await userApi.changePassword(oldPassword, newPassword);
        setSuccessMessage(response.message || 'Mật khẩu đã được thay đổi thành công!');
        // Clear form fields
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        // Chuyển hướng sau x giây
        setTimeout(() => navigate('/user/profile'), 3000);
      } catch (err) {
        setApiError(err.message || 'Đã xảy ra lỗi khi đổi mật khẩu.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    // Xóa lỗi API và thành công message khi có bất kỳ thay đổi nào
    if (apiError || successMessage) {
      setApiError('');
      setSuccessMessage('');
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className={styles.passwordForm}>
        <div className={styles.formGroup}>
          <label htmlFor="oldPassword" className={styles.label}>Mật khẩu cũ:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={handleInputChange(setOldPassword, 'oldPassword')}
            className={`${styles.inputField} ${errors.oldPassword ? styles.inputError : ''}`}
            required
            disabled={loading}
          />
          {errors.oldPassword && <p className={styles.errorMessage}>{errors.oldPassword}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword" className={styles.label}>Mật khẩu mới:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handleInputChange(setNewPassword, 'newPassword')}
            className={`${styles.inputField} ${errors.newPassword ? styles.inputError : ''}`}
            required
            disabled={loading}
          />
          {errors.newPassword && <p className={styles.errorMessage}>{errors.newPassword}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmNewPassword" className={styles.label}>Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleInputChange(setConfirmNewPassword, 'confirmNewPassword')}
            className={`${styles.inputField} ${errors.confirmNewPassword ? styles.inputError : ''}`}
            required
            disabled={loading}
          />
          {errors.confirmNewPassword && <p className={styles.errorMessage}>{errors.confirmNewPassword}</p>}
        </div>

        {apiError && <p className={styles.errorMessage}>{apiError}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;