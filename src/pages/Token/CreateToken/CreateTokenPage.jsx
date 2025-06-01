// src/pages/Tokens/CreateTokenPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenApi from '../../../services/api/tokenApi.js';
import LoadingSpinner from '../../../components/Common/LoadingSpinner/LoadingSpinner.jsx';
import { validateContractAddress, validateRequired, composeValidators} from '../../../utils/helpers/validators.js';
import { fetchTokenOnChainInfo } from '../../../services/blockchain/evm/tokenFetcher.js'; // Import hàm fetch on-chain mới
import styles from './CreateTokenPage.module.css';
import CONFIG from '../../../utils/config/config.js';

const SUPPORTED_CHAINS = CONFIG[import.meta.env.VITE_MODE].SUPPORTED_CHAINS;

const CreateTokenPage = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [coingeckoId, setCoingeckoId] = useState('');

  const [isFetchingOnChain, setIsFetchingOnChain] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [onChainError, setOnChainError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const validateTokenAddress = composeValidators(
    (value) => validateRequired(value, 'Xác nhận mật khẩu mới'),
    (value) => validateTokenAddress(value, 'Dia chi Token')
  );

  // Hàm validate form (giữ nguyên hoặc điều chỉnh theo nhu cầu)
  const validateForm = (isSubmit = false) => {
    const errors = {};

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [address, chain, name, symbol, decimals]);

  // Hàm fetch thông tin token on-chain (thay đổi tại đây)
  const handleFetchOnChainInfo = useCallback(async () => {
    setOnChainError(null);
    setFormErrors({});
    const tempErrors = {};

    if (Object.keys(tempErrors).length > 0) {
      setFormErrors(tempErrors);
      return;
    }

    setIsFetchingOnChain(true);
    try {
      // GỌI HÀM FETCH ON-CHAIN TRỰC TIẾP TỪ FRONTEND
      const data = await fetchTokenOnChainInfo(address, chain);
      setName(data.name || '');
      setSymbol(data.symbol || '');
      setDecimals(data.decimals !== undefined ? String(data.decimals) : ''); // Decimals có thể là số 0
    } catch (err) {
      setOnChainError(err.message || 'Không thể lấy thông tin token on-chain. Vui lòng kiểm tra địa chỉ và chain.');
      console.error('Error fetching on-chain info:', err);
    } finally {
      setIsFetchingOnChain(false);
    }
  }, [address, chain]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm(true)) {
      alert('Vui lòng kiểm tra lại các trường thông tin bị lỗi.');
      return;
    }

    // Đảm bảo decimals là số hợp lệ trước khi gửi
    const parsedDecimals = Number(decimals);
    if (isNaN(parsedDecimals)) {
        setSubmitError('Số thập phân không hợp lệ.');
        return;
    }

    setIsLoadingSubmit(true);
    try {
      const tokenData = {
        address: address.toLowerCase(),
        chain,
        name,
        symbol,
        decimals: parsedDecimals,
        logoUrl: logoUrl || null,
        website: website || null,
        description: description || null,
        coingeckoId: coingeckoId || null,
      };
      await tokenApi.createToken(tokenData); // Gửi dữ liệu token đã hoàn chỉnh lên backend
      alert('Token đã được tạo thành công!');
      navigate('/tokens'); // Chuyển hướng về trang danh sách token
    } catch (err) {
      setSubmitError(err.message || 'Không thể tạo token. Vui lòng thử lại.');
      console.error('Error creating token:', err);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Tạo Token Mới</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="address" className={styles.label}>Địa chỉ Contract Token:</label>
          <input
            type="text"
            id="address"
            className={`${styles.input} ${formErrors.address ? styles.inputError : ''}`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            disabled={isFetchingOnChain || isLoadingSubmit}
            required
          />
          {formErrors.address && <p className={styles.errorMessage}>{formErrors.address}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="chain" className={styles.label}>Chain:</label>
          <select
            id="chain"
            className={`${styles.input} ${formErrors.chain ? styles.inputError : ''}`}
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            disabled={isFetchingOnChain || isLoadingSubmit}
            required
          >
            {SUPPORTED_CHAINS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {formErrors.chain && <p className={styles.errorMessage}>{formErrors.chain}</p>}
        </div>

        <button
          type="button"
          onClick={handleFetchOnChainInfo}
          className={styles.submitButton}
          disabled={isFetchingOnChain || isLoadingSubmit || !address || !chain || formErrors.address || formErrors.chain}
          style={{ marginBottom: '20px', backgroundColor: '#6c757d' }}
        >
          {isFetchingOnChain ? <LoadingSpinner /> : 'Fetch On-chain Info'}
        </button>
        {onChainError && <p className={styles.serverError}>{onChainError}</p>}

        <hr style={{ margin: '30px 0' }} />

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Tên Token:</label>
          <input
            type="text"
            id="name"
            className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoadingSubmit}
            required
          />
          {formErrors.name && <p className={styles.errorMessage}>{formErrors.name}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="symbol" className={styles.label}>Ký hiệu Token:</label>
          <input
            type="text"
            id="symbol"
            className={`${styles.input} ${formErrors.symbol ? styles.inputError : ''}`}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            disabled={isLoadingSubmit}
            required
          />
          {formErrors.symbol && <p className={styles.errorMessage}>{formErrors.symbol}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="decimals" className={styles.label}>Số Thập phân (Decimals):</label>
          <input
            type="number"
            id="decimals"
            className={`${styles.input} ${formErrors.decimals ? styles.inputError : ''}`}
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            disabled={isLoadingSubmit}
            required
          />
          {formErrors.decimals && <p className={styles.errorMessage}>{formErrors.decimals}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="logoUrl" className={styles.label}>URL Logo:</label>
          <input
            type="text"
            id="logoUrl"
            className={styles.input}
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
            disabled={isLoadingSubmit}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="website" className={styles.label}>Website:</label>
          <input
            type="text"
            id="website"
            className={styles.input}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
            disabled={isLoadingSubmit}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Mô tả:</label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            disabled={isLoadingSubmit}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="coingeckoId" className={styles.label}>Coingecko ID:</label>
          <input
            type="text"
            id="coingeckoId"
            className={styles.input}
            value={coingeckoId}
            onChange={(e) => setCoingeckoId(e.target.value)}
            placeholder="bitcoin, ethereum..."
            disabled={isLoadingSubmit}
          />
        </div>

        {submitError && <p className={styles.serverError}>{submitError}</p>}

        <button type="submit" className={styles.submitButton} disabled={isLoadingSubmit || isFetchingOnChain}>
          {isLoadingSubmit ? 'Đang gửi...' : 'Tạo Token'}
        </button>
      </form>
    </div>
  );
};

export default CreateTokenPage;