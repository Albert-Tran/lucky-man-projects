import React, { useState, useEffect } from 'react';
import styles from './WalletForm.module.css';
import { validateRequired, validateMinLength, composeValidators } from '../../../utils/helpers/validators.js';

const WalletGroupForm = ({ initialData, walletGroups, onSubmit, isLoading, error, buttonText }) => {
  const [walletCount, setWalletCount] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
    } else {
      setName('');
    }
    setErrors({}); // Xóa lỗi khi dữ liệu ban đầu thay đổi
  }, [initialData]);

  const validateName = composeValidators(
    (value) => validateRequired(value, 'Tên Ví'),
    (value) => validateMinLength(value, 5, 'Tên ví'), // Ví dụ min length 8
  );

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ name });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Tên nhóm ví:</label>
        <input
          type="text"
          id="name"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
      </div>

      {error && <p className={styles.serverError}>{error}</p>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Đang xử lý...' : buttonText}
      </button>
    </form>
  );
};

export default WalletGroupForm;