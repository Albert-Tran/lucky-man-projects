// src/pages/SwapModeSelectPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TokenSelect from '../../../components/Token/TokenSelect/TokenSelect.jsx';
import styles from './SwapPage.module.css';


const SelectModeAndTokenSwapPage = () => {
  const { chainId } = useParams();
  const navigate = useNavigate();

  const [swapMode, setSwapMode] = useState(''); // 'token_to_native' hoặc 'native_to_token'
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(''); // State cho token được chọn
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!chainId) {
      navigate('/finance/swap'); // Go back to chain selection if no chainId
    }
    setFormErrors({});
    // Reset mode và token khi chainId thay đổi
    setSwapMode('');
    setSelectedTokenAddress('');
  }, [chainId, navigate]);

  // Reset token khi swapMode thay đổi
  useEffect(() => {
    setSelectedTokenAddress('');
  }, [swapMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    let isValid = true;

    if (!swapMode) {
      errors.mode = 'Please select a swap mode.';
      isValid = false;
    }

    // Validate token selection only if a mode is chosen
    if (swapMode && !selectedTokenAddress) {
      errors.token = `Please select a token for ${swapMode === 'token_to_native' ? 'swapping from' : 'swapping to'}.`;
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      // Navigate to the final step with chainId, swapMode, and selectedTokenAddress
      navigate(`/finance/swap/chain/${chainId}/mode/${swapMode}/token/${selectedTokenAddress}`);
    }
  };

  const displayChainName = chainId ? chainId.toUpperCase() : 'N/A';

  return (
    <div className={styles.pageContainer}>
      <h1>Swap - Step 2: Select Mode & Token</h1>
      <p className={styles.summaryText}>
        Selected Chain: <strong>{displayChainName}</strong>
      </p>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>1. Choose Swap Direction</h2>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="token_to_native"
              checked={swapMode === 'token_to_native'}
              onChange={() => setSwapMode('token_to_native')}
            />
            Token to Native (e.g., USDT to ETH)
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="native_to_token"
              checked={swapMode === 'native_to_token'}
              onChange={() => setSwapMode('native_to_token')}
            />
            Native to Token (e.g., ETH to USDT)
          </label>
        </div>
        {formErrors.mode && <p className={styles.errorMessage}>{formErrors.mode}</p>}

        {/* Display token selection component only if a swapMode is chosen */}
        {swapMode && (
          <>
            <h2 className={styles.subHeading}>2. Select Token to {swapMode === 'token_to_native' ? 'Swap From' : 'Swap To'}</h2>
            <div className={styles.formGroup}>
              <TokenSelect
                label={swapMode === 'token_to_native' ? "Token to swap FROM" : "Token to swap TO"}
                chainId={chainId}
                value={selectedTokenAddress}
                onChange={setSelectedTokenAddress}
                placeholder="Search and select a token..."
                formErrors={formErrors.token}
              />
              {/* {formErrors.token && <p className={styles.errorMessage}>{formErrors.token}</p>} */}
            </div>
          </>
        )}

        <div className={styles.navigationButtons}>
          <button
            type="button"
            onClick={() => navigate(`/finance/swap`)}
            className={styles.prevButton}
          >
            Previous
          </button>
          <button type="submit" className={styles.nextButton}>
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectModeAndTokenSwapPage;