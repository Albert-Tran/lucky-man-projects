// src/components/SenderSelect.jsx
import React from 'react';
import WalletSelect from '../../Wallet/WalletSelect/WalletSelect.jsx'; // Component WalletSelect đã tạo
import styles from '../../../pages/Finance/Transfer/TransferPage.module.css'; // Sử dụng lại CSS của trang Transfer

const SenderSelect = ({ value, onChange, onRemove, placeholder, index, formErrors }) => {
  return (
    <div className={`${styles.formGroup} ${styles.dynamicInputGroup}`}>
      <label htmlFor={`sender-wallet-${index}`} className={styles.label}>
        Ví chuyển {index + 1}:
      </label>
      <div className={styles.selectWithRemoveButton}>
        <WalletSelect
          value={value}
          onChange={(selectedValue) => onChange(index, selectedValue)}
          placeholder={placeholder}
          formErrors={formErrors}
          isDisabled={false} // Luôn cho phép chọn ví gửi
        />
        {onRemove && (
          <button type="button" className={styles.removeButton} onClick={() => onRemove(index)}>
            &times;
          </button>
        )}
      </div>
      {formErrors && <p className={styles.errorMessage}>{formErrors}</p>}
    </div>
  );
};

export default SenderSelect;