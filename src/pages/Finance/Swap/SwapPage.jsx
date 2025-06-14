// src/pages/TransferPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../../../components/Common/Select/SimpleSelect.jsx';
import styles from './SwapPage.module.css';
import CONFIG from '../../../utils/config/config.js';

const SUPPORTED_CHAINS = CONFIG[import.meta.env.VITE_MODE].SUPPORTED_CHAINS;
const SELECTED_CHAINS = [
  { value: '', label: 'Chọn chain' },
  ...SUPPORTED_CHAINS
];

const SwapPage = () => {
  const [selectedChain, setSelectedChain] = useState('');
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/finance');
  };

  const handleNext = () => {
    if (!selectedChain) {
      setFormError('Please select a blockchain.');
      return;
    }
    setFormError(null);
    navigate(`/finance/swap/chain/${selectedChain}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Wallet Swap - Step 1: Select Blockchain</h1>

      <div className={styles.formSection}>
        <h2>Select Blockchain</h2>
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

export default SwapPage;