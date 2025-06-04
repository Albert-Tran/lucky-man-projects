import React, { useState, useEffect } from 'react';
import styles from './WalletForm.module.css';
import { validateRequired, validateNumber, validateMin, composeValidators } from '../../../utils/helpers/validators.js';

const WalletGroupForm = ({ initialData, walletGroups, fetchingWalletGroupsError, isFetchingWalletGroups, onSubmit, isLoading, error, buttonText }) => {
  const [walletCount, setWalletCount] = useState(0);
  const [walletGroupId, setWalletGroupId] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setWalletCount(initialData.walletCount || '');
    } else {
      setWalletCount('');
    }
    setFormErrors({}); // Xóa lỗi khi dữ liệu ban đầu thay đổi
  }, [initialData]);

  const validateWalletCount = composeValidators(
    (value) => validateRequired(value, 'So luong Ví'),
    (value) => validateNumber(value, 'so luong ví')
  );

  const validateWalletGroupId = composeValidators(
    (value) => validateMin(value, 1, 'Nhom Ví')
  );

  const validateForm = () => {
    const errors = {};

    const walletCountError = validateWalletCount(walletCount);
    if (walletCountError) errors.walletCount = walletCountError;
    console.log(walletGroupId);
    const walletGroupIdError = validateWalletGroupId(walletGroupId);
    if (walletGroupIdError) errors.walletGroupId = walletGroupIdError;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ count: walletCount, group_id: walletGroupId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>So luong ví:</label>
        <input
          type="text"
          id="wallet_count"
          className={`${styles.input} ${formErrors.walletCount ? styles.inputError : ''}`}
          value={walletCount}
          onChange={(e) => setWalletCount(e.target.value)}
          disabled={isLoading}
        />
        {formErrors.walletCount && <p className={styles.errorMessage}>{formErrors.walletCount}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="chain" className={styles.label}>Nhom vi:</label>
        <select
          id="wallet_group_id"
          className={`${styles.input} ${formErrors.walletGroupId ? styles.inputError : ''}`}
          value={walletGroupId}
          onChange={(e) => setWalletGroupId(Number(e.target.value))}
          disabled={isFetchingWalletGroups || isLoading}
        >
          <option key="" value="">Lua chon nhom vi</option>
          {walletGroups.map(walletGroup => (
            <option key={walletGroup.value} value={walletGroup.value}>{walletGroup.label}</option>
          ))}
        </select>
        {formErrors.walletGroupId && <p className={styles.errorMessage}>{formErrors.walletGroupId}</p>}
      </div>
      {error && <p className={styles.serverError}>{error}</p>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Đang xử lý...' : buttonText}
      </button>
    </form>
  );
};

export default WalletGroupForm;