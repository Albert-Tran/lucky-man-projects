// src/pages/ChainTransferPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TokenSelect from '../../../components/Token/TokenSelect/TokenSelect.jsx'; // Import TokenSelect
import styles from './TransferPage.module.css'; // Vẫn tái sử dụng CSS

const ChainTransferPage = () => {
  const { chainId } = useParams(); // Lấy chainId từ URL
  const navigate = useNavigate();

  const [selectedToken, setSelectedToken] = useState('');
  const [formError, setFormError] = useState(null);

  const handleNext = () => {
    if (!selectedToken) {
      setFormError('Please select a token.');
      return;
    }
    setFormError(null);
    // Chuyển hướng đến URL mới với chainId và tokenAddress
    navigate(`/finance/transfer/chain/${chainId}/token/${selectedToken}`);
  };

  const handleBack = () => {
    navigate('/finance/transfer'); // Quay lại trang chọn chain
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Wallet Transfer - Step 2: Select Token for {chainId.toUpperCase()}</h1>
      
      <div className={styles.formSection}>
        <h2>Select Token</h2>
        <div className={styles.formGroup}>
          <label htmlFor="tokenSelect">Token:</label>
          <TokenSelect
            chainId={chainId}
          />
          {formError && <p className={styles.errorMessage}>{formError}</p>}
        </div>
        
        <div className={styles.navigationButtons}>
          <button onClick={handleBack} className={styles.prevButton}>
            Previous
          </button>
          <button
            onClick={handleNext}
            className={styles.nextButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChainTransferPage;