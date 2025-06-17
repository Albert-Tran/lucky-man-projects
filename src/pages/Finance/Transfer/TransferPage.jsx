// src/pages/TransferPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../../../components/Common/Select/SimpleSelect.jsx';
import styles from './TransferPage.module.css';
import CONFIG from '../../../utils/config/config.js';

const SUPPORTED_CHAINS = CONFIG[import.meta.env.VITE_MODE].SUPPORTED_CHAINS;
const SELECTED_CHAINS = [
  { value: '', label: 'Chọn chain' },
  ...SUPPORTED_CHAINS
];

const TransferPage = () => {
  const [selectedChain, setSelectedChain] = useState('');
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/finance');
  };

  const handleNext = () => {
    if (!selectedChain) {
      setFormError('Bắt buộc chọn mạng.');
      return;
    }
    setFormError(null);
    navigate(`/finance/transfer/chain/${selectedChain}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Chuyển Khoản - Bước 1: Chọn Mạng</h1>

      <div className={styles.formSection}>
        <h2>Chọn Mạng</h2>
        <div className={styles.formGroup}>
          <CustomSelect
            id="chainSelect"
            options={SELECTED_CHAINS}
            value={selectedChain}
            onChange={setSelectedChain}
            placeholder="Select Chain"
            formErrors={formError}
          />
          {formError && <p className={styles.errorMessage}>{formError}</p>}
        </div>
        <div className={styles.navigationButtons}>
          <button onClick={handleBack} className={styles.prevButton}>
            Quay lại
          </button>
          <button
            onClick={handleNext}
            className={styles.nextButton}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;