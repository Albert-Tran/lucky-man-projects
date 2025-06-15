import React from 'react';
import WalletSelect from '../WalletSelect/WalletSelect.jsx'; // Component chọn ví đã có
import styles from './WalletAmountInput.module.css'; // Sử dụng lại style chung từ trang Transfer

const WalletAmountInput = ({
  index,
  walletValue,
  amountValue,
  onWalletChange,
  onAmountChange,
  onRemove,
  walletPlaceholder,
  amountPlaceholder,
  walletErrors,
  amountErrors,
  isDisabled = false, // Thêm prop để vô hiệu hóa khi đang tải
}) => {
  return (
    <div className={`${styles.dynamicInputGroup} ${styles.formGroup}`}>
      {onRemove && ( // Hiển thị nút xóa nếu hàm onRemove được cung cấp
        <button type="button" className={styles.removeButton} onClick={() => onRemove(index)} disabled={isDisabled}>
          &times;
        </button>
      )}
      <div className={styles.formGroup}>
        <WalletSelect
          label={`Wallet ${index + 1}`}
          value={walletValue}
          onChange={(val) => onWalletChange(index, val)}
          placeholder={walletPlaceholder}
          formErrors={walletErrors}
          isDisabled={isDisabled}
        />
        {/* {walletErrors && <p className={styles.errorMessage}>{walletErrors}</p>} */}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`swap-amount-${index}`} className={styles.label}>
          Amount {index + 1}:
        </label>
        <input
          type="text"
          id={`swap-amount-${index}`}
          className={`${styles.inputField} ${amountErrors ? styles.error : ''}`}
          placeholder={amountPlaceholder}
          value={amountValue}
          onChange={(e) => onAmountChange(index, e.target.value)}
          step="any" // Cho phép số thập phân
          min="0" // Đảm bảo số lượng không âm
          disabled={isDisabled}
        />
        {amountErrors && <p className={styles.errorMessage}>{amountErrors}</p>}
      </div>
    </div>
  );
};

export default WalletAmountInput;