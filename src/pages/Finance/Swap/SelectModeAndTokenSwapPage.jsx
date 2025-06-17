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
      errors.mode = 'Bắt bưộc chọn chế độ trao đổi.';
      isValid = false;
    }

    // Validate token selection only if a mode is chosen
    if (swapMode && !selectedTokenAddress) {
      errors.token = `Please select a token for ${swapMode === 'token_to_native' ? 'swapping from' : 'swapping to'}.`;
      isValid = false;
    }

    setFormErrors(errors);
    console.log('SelectModeAndTokenSwapPage::handleSubmit');
    
    if (isValid) {
      // Navigate to the final step with chainId, swapMode, and selectedTokenAddress
      console.log('SelectModeAndTokenSwapPage::handleSubmit:isValid');
      navigate(`/finance/swap/chain/${chainId}/mode/${swapMode}/token/${selectedTokenAddress}`);
    }
  };

  const displayChainName = chainId ? chainId.toUpperCase() : 'N/A';

  return (
    <div className={styles.pageContainer}>
      <h1>Trao đổi - Bước 2: Chọn chế độ trao đổi & Token</h1>
      <p className={styles.summaryText}>
        Mạng: <strong>{displayChainName}</strong>
      </p>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>1. Chọn chế độ trao đổi</h2>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="token_to_native"
              checked={swapMode === 'token_to_native'}
              onChange={() => setSwapMode('token_to_native')}
            />
            Token sang Native (e.g., USDT sang ETH)
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="native_to_token"
              checked={swapMode === 'native_to_token'}
              onChange={() => setSwapMode('native_to_token')}
            />
            Native sang Token (e.g., ETH sang USDT)
          </label>
        </div>
        {formErrors.mode && <p className={styles.errorMessage}>{formErrors.mode}</p>}

        {/* Display token selection component only if a swapMode is chosen */}
        {swapMode && (
          <>
            <h2 className={styles.subHeading}>2. Chọn token để {swapMode === 'token_to_native' ? 'trao đổi sang native' : 'trao đổi native sang'}</h2>
            <div className={styles.formGroup}>
              <TokenSelect
                label={swapMode === 'token_to_native' ? "Token to swap FROM" : "Token to swap TO"}
                chainId={chainId}
                value={selectedTokenAddress}
                onChange={setSelectedTokenAddress}
                placeholder="Chọn token..."
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
            Quay lại
          </button>
          <button type="submit" className={styles.nextButton}>
            Tiếp tục
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectModeAndTokenSwapPage;