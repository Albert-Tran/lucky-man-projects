import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tokenApi from '../../../services/api/tokenApi.js'; // Import API mới
import walletApi from '../../../services/api/walletApi.js'; // Import API mới
import WalletTable from '../../../components/Wallet/WalletTable/WalletTable.jsx'; // Import component bảng
import { validateRequired, composeValidators } from '../../../utils/helpers/validators.js'; // Dùng lại validator
import pageStyles from './DetailWalletGroupPage.module.css'; // Style riêng cho trang này
import CONFIG from '../../../utils/config/config.js';

const SUPPORTED_CHAINS = CONFIG[import.meta.env.VITE_MODE].SUPPORTED_CHAINS;
const SELECTED_CHAINS = [
  { value: '', label: 'Chọn chain' },
  ...SUPPORTED_CHAINS
];

const DetailWalletGroupPage = () => {
    const { id } = useParams();
    const [walletGroup, setWalletGroup] = useState({ }); // Giả định có dữ liệu nhóm ví
    const [fetchingWalletGroupsError, setFetchingWalletGroupsError] = useState(null); // Lỗi khi fetch nhóm ví
    const [isFetchingWalletGroups, setIsFetchingWalletGroups] = useState(false); // Trạng thái đang fetch nhóm ví
    const [selectedChain, setSelectedChain] = useState('');
    const [availableTokens, setAvailableTokens] = useState([]); // Danh sách token dựa trên chain
    const [selectedToken, setSelectedToken] = useState('');
    const [walletData, setWalletData] = useState([]); // Dữ liệu số dư ví
    const [totalBalance, setTotalBalance] = useState('');
    const [isLoadingTokens, setIsLoadingTokens] = useState(false);
    const [tokenError, setTokenError] = useState(null);

    const [isLoadingWallets, setIsLoadingWallets] = useState(false);
    const [walletError, setWalletError] = useState(null);

    const [formErrors, setFormErrors] = useState({}); // Lỗi validation cho form chọn
    const [message, setMessage] = useState(''); // Để hiển thị thông báo thành công/lỗi
    
    const validateChainId = composeValidators(
        (value) => validateRequired(value, 'Nhóm Ví')
    );

    const validateTokenAddress = composeValidators(
        (value) => validateRequired(value, 'Token')
    );

    useEffect(() => {
        const fetchWalletGroup = async () => {
            setIsFetchingWalletGroups(true);
            setFetchingWalletGroupsError(null);
            try {
                const data = await walletApi.getWalletGroupById(id);
                setWalletGroup(data);
            } catch (err) {
                console.error('Error fetching wallet groups:', err);
                setFetchingWalletGroupsError('Không thể tải được dữ liệu nhóm ví.');
            } finally {
                setIsFetchingWalletGroups(false);
            }
        };

        fetchWalletGroup();
    }, []);

    useEffect(() => {
        setAvailableTokens([]);
        setSelectedToken('');
        setWalletData([]);
        setTokenError(null);
        setWalletError(null);
        setFormErrors({});

        if (selectedChain) {
            const fetchTokens = async () => {
                setIsLoadingTokens(true);
                setTokenError(null);
                try {
                    console.log(selectedChain);
                    const tokenResponse = await tokenApi.getTokensByChainId(selectedChain);
                    const formattedTokens = tokenResponse.tokens.map(token => ({
                        value: token.address,
                        label: `${token.token_name}`,
                    }));
                    setAvailableTokens([{ value: '', label: 'Chọn Token' }, { value: 'native_token', label: 'Native Token' }, ...formattedTokens]);
                } catch (err) {
                    console.error('Error fetching tokens:', err);
                    setTokenError(err.response?.data?.message || 'Lỗi khi tải dữ liệu. Thử lại sau');
                } finally {
                setIsLoadingTokens(false);
            }
        };
        fetchTokens();
        }
    }, [selectedChain]);

  // Handle khi click nút "Load Data"
  const handleLoadData = async () => {
    const newErrors = {};
    const chainError = validateChainId(selectedChain);
    const tokenError = validateTokenAddress(selectedToken);
    if (chainError) newErrors.chain = chainError;
    if (tokenError) newErrors.token = tokenError;
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setWalletData([]); // Xóa dữ liệu cũ nếu có lỗi
      setMessage('');
      return;
    }

    setFormErrors({}); // Xóa lỗi form nếu hợp lệ
    setIsLoadingWallets(true);
    setWalletError(null);
    setMessage('');
    setWalletData([]); // Xóa dữ liệu cũ trước khi tải mới
    try {
      let wallets = [];
      if (selectedToken == 'native_token') {
        const walletResponse = await walletApi.getWalletsByGroupId(id, {chainId: selectedChain});
        wallets = walletResponse.wallets.map(wallet => {
            return {
                ...wallet,
                balance: wallet.native_balance
            };
        });
        setTotalBalance(walletResponse.totalNativeBalance);
      } else {
        const walletResponse = await walletApi.getWalletsWithTokenBalance({groupId: id, tokenAddress: selectedToken, chainId: selectedChain});
        wallets = walletResponse.wallets.map(wallet => {
            return {
                ...wallet,
                balance: wallet.tokenBalance
            };
        });
        setTotalBalance(walletResponse.totalTokenBalance);
      }
      setWalletData(wallets);
      setMessage(`Tải dữ liệu thành công.`);
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setWalletError(err.response?.data?.message || 'Có lỗi khi tải. Thử lại sau');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  // Effect để tự động ẩn message (như đã làm với WalletManagementPage)
  useEffect(() => {
    let timer;
    if (message || walletError || tokenError || fetchingWalletGroupsError) { // Tắt cả thông báo lỗi/thành công
      timer = setTimeout(() => {
        setMessage('');
        setWalletError(null);
        setTokenError(null);
        setFetchingWalletGroupsError(null);
        setFormErrors({});
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [message, walletError, tokenError]); // Dependencies cho effect này

  return (
    <div className={pageStyles.pageContainer}>
      <h1>Chi tiết nhóm ví: {isFetchingWalletGroups ? '...' : walletGroup.name}</h1>

      {message && <p className={pageStyles.messageSuccess}>{message}</p>}
      {(tokenError || walletError || formErrors.chain || formErrors.token || fetchingWalletGroupsError) &&
        <p className={pageStyles.messageError}>
          {tokenError || walletError || formErrors.chain || formErrors.token}
        </p>
      }

      <div className={pageStyles.controlsContainer}>
        <div className={pageStyles.formGroup}>
          <label htmlFor="chainSelect">Chọn Chain:</label>
          <select
            id="chainSelect"
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
          >
            {SELECTED_CHAINS.map((chain) => (
              <option key={chain.value} value={chain.value}>
                {chain.label}
              </option>
            ))}
          </select>
        </div>

        <div className={pageStyles.formGroup}>
          <label htmlFor="tokenSelect">Chọn Token:</label>
          <select
            id="tokenSelect"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            disabled={!selectedChain || isLoadingTokens} // Disable nếu chưa chọn chain hoặc đang tải token
          >
            {isLoadingTokens ? (
              <option value="">Đang tải token...</option>
            ) : availableTokens.length > 0 ? (
              availableTokens.map((token) => (
                <option key={token.value} value={token.value}>
                  {token.label}
                </option>
              ))
            ) : (
              <option value="">Không có token phù hợp</option>
            )}
          </select>
        </div>

        <button
          onClick={handleLoadData}
          disabled={!selectedChain || !selectedToken || isLoadingWallets}
          className={pageStyles.loadButton}
        >
          {isLoadingWallets ? 'Đang tải dữ liệu...' : 'Tải dữ liệu'}
        </button>
      </div>

      <WalletTable
        totalBalance={totalBalance}
        walletData={walletData}
        loading={isLoadingWallets}
        error={walletError}
      />
    </div>
  );
};

export default DetailWalletGroupPage;