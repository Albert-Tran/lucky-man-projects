// src/pages/ChainTransferPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TokenSelect from '../../../components/Token/TokenSelect/TokenSelect.jsx'; // Import TokenSelect
import styles from './TransferPage.module.css'; // Vẫn tái sử dụng CSS
import {getChainNameById}  from '../../../utils/helpers/getConfig.js';
const SelectTokenTransferPage = () => {
  const { chainId } = useParams();
  const navigate = useNavigate();

  const [selectedTokenAddress, setSelectedTokenAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // THÊM STATE MỚI CHO LOẠI TOKEN ĐƯỢC CHỌN
  const [tokenType, setTokenType] = useState('custom_token'); // Mặc định là 'custom_token'

  // Khi component mount hoặc chainId thay đổi, reset các giá trị
  useEffect(() => {
    if (!chainId) {
      navigate('/'); // Quay về trang chọn chain nếu không có chainId
    }
    setSelectedTokenAddress(''); // Reset token đã chọn
    setFormErrors({}); // Reset lỗi
    setTokenType('custom_token'); // Mặc định chọn Custom Token khi vào trang
  }, [chainId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    let isValid = true;

    if (tokenType === 'custom_token') {
      if (!selectedTokenAddress) {
        errors.token = 'Please select a token.';
        isValid = false;
      }
    }
    // Đối với native token, không cần validation vì đã chọn loại
    setFormErrors(errors);

    if (isValid) {
      if (tokenType === 'native_token') {
        // Nếu là native token, chuyển hướng ngay sang bước 3 với một giá trị đặc biệt
        // để biểu thị native token (ví dụ: 'NATIVE_TOKEN' hoặc '0x0')
        navigate(`/finance/transfer/chain/${chainId}/token/NATIVE_TOKEN`);
      } else {
        // Nếu là custom token, dùng địa chỉ token đã chọn
        navigate(`/finance/transfer/chain/${chainId}/token/${selectedTokenAddress}`);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Wallet Transfer - Step 2: Select Token</h1>
      <p className={styles.summaryText}>
        Selected Chain: <strong>{getChainNameById(chainId).toUpperCase()}</strong>
      </p>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>Choose Token Type</h2>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="native_token"
              checked={tokenType === 'native_token'}
              onChange={() => {
                setTokenType('native_token');
                setSelectedTokenAddress(''); // Xóa lựa chọn token cũ khi chuyển loại
                setFormErrors({}); // Xóa lỗi
              }}
            />
            Native Token (e.g., ETH, BNB)
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="custom_token"
              checked={tokenType === 'custom_token'}
              onChange={() => {
                setTokenType('custom_token');
                // Không xóa selectedTokenAddress ở đây nếu người dùng muốn quay lại lựa chọn cũ
                setFormErrors({}); // Xóa lỗi
              }}
            />
            Custom Token (ERC-20, etc.)
          </label>
        </div>

        {/* HIỂN THỊ SELECT CUSTOM TOKEN CHỈ KHI tokenType LÀ 'custom_token' */}
        {tokenType === 'custom_token' && (
          <div className={styles.formGroup}>
            <TokenSelect
              label="Select Custom Token"
              chainId={chainId}
              value={selectedTokenAddress}
              onChange={setSelectedTokenAddress}
              placeholder="Search and select a token..."
              formErrors={formErrors.token}
            />
            {/* {formErrors.token && <p className={styles.errorMessage}>{formErrors.token}</p>} */}
          </div>
        )}

        <div className={styles.navigationButtons}>
          <button
            type="button"
            onClick={() => navigate('/finance/transfer')}
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

export default SelectTokenTransferPage;