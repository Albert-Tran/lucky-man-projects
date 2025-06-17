// src/components/ReceiverInput.jsx
import React from 'react';
import styles from '../../../pages/Finance/Transfer/TransferPage.module.css'; // Sử dụng lại CSS của trang Transfer

const ReceiverInput = ({ value, onChange, onRemove, placeholder, index, formErrors }) => {
  return (
    <div className={`${styles.formGroup} ${styles.dynamicInputGroup}`}>
      <label htmlFor={`receiver-address-${index}`} className={styles.label}>
        Ví nhận {index + 1}:
      </label>
      <div className={styles.inputWithRemoveButton}>
        <input
          type="text"
          id={`receiver-address-${index}`}
          className={`${styles.inputField} ${formErrors ? styles.error : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
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

export default ReceiverInput;