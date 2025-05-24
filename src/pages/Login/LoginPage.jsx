import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { validateRequired, validateMinLength, validateEmail } from '../../utils/helpers/validators.js';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); 
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const validateForm = () => {
    let newErrors = {};

    // Validate Username
    let error = validateRequired(username, 'Tên đăng nhập');
    if (error) {
      newErrors.username = error;
    } else {
      error = validateMinLength(username, 3, 'Tên đăng nhập');
      if (error) newErrors.username = error;
    }

    // Validate Password
    error = validateRequired(password, 'Mật khẩu');
    if (error) {
      newErrors.password = error;
    } else {
      error = validateMinLength(password, 6, 'Mật khẩu');
      if (error) newErrors.password = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      const success = await login(username, password);

      if (success) {
        navigate('/');
      } else {
        // Lỗi từ API (tên đăng nhập/mật khẩu sai)
        setErrors(prev => ({ ...prev, api: 'Tên đăng nhập hoặc mật khẩu không đúng!' }));
      }
    } else {
      // Nếu form không hợp lệ, lỗi đã được hiển thị qua setErrors
      console.log('Form có lỗi, vui lòng kiểm tra lại.');
    }
  };

  // Hàm để xóa lỗi khi người dùng nhập liệu lại
  const handleInputChange = (fieldName, setter) => (e) => {
    setter(e.target.value);
    // Xóa lỗi cho trường này khi người dùng bắt đầu nhập lại
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        // Đảm bảo xóa lỗi API nếu có
        if (newErrors.api) delete newErrors.api;
        return newErrors;
      });
    }
    // Xóa lỗi API khi có bất kỳ thay đổi nào
    if (errors.api) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.api;
            return newErrors;
        });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleInputChange('username', setUsername)}
            className={`${styles.inputField} ${errors.username ? styles.inputError : ''}`}
          />
          {errors.username && <p className={styles.errorMessage}>{errors.username}</p>} {/* Hiển thị lỗi */}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange('password', setPassword)} // Sử dụng handleInputChange
            className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
        </div>
        {errors.api && <p className={styles.errorMessage}>{errors.api}</p>} {/* Lỗi từ API */}
        <button type="submit" className={styles.submitButton}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
