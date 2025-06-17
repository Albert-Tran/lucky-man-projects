// src/pages/TransferFinalStepPage.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams, useNavigate } from 'react-router-dom';
import WalletSelect from '../../../components/Wallet/WalletSelect/WalletSelect.jsx'; // Component chọn ví (cho sender mặc định 1-Many)
import ReceiverInput from '../../../components/Finance/ReceiverInput/ReceiverInput.jsx'; // Input cho người nhận (One-to-Many)
import SenderSelect from '../../../components/Finance/SenderSelect/SenderSelect.jsx';   // Select cho người gửi (Many-to-One)
import styles from './TransferPage.module.css'; // Tái sử dụng CSS
import financeApi from '../../../services/api/financeApi.js';
import {getChainNameById, getMultiCallContractAddressKeyByChainId} from '../../../utils/helpers/getConfig.js';
import { formatPriceWithDecimals } from '../../../utils/helpers/pricingFormatter.js';
import tokenApi from '../../../services/api/tokenApi.js';
import configApi from '../../../services/api/configApi.js';
import walletApi from '../../../services/api/walletApi.js';
import {getTokenAmountAllowance} from '../../../services/blockchain/evm/tokenFetcher.js';

const SelectModeAndWalletTransferPage = () => {
  const { chainId, tokenAddress } = useParams();
  const navigate = useNavigate();
  const [tokenName, setTokenName] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const [transferMode, setTransferMode] = useState('one_to_many');
  const [oneToManySender, setOneToManySender] = useState('');
  const [manyToOneReceiver, setManyToOneReceiver] = useState('');
  const [multiCallContractAddress, setMultiCallContractAddress] = useState('');
  // Mảng các ví nhận cho One-to-Many
  const [receivers, setReceivers] = useState(['']);
  const [approvedTokenAmount, setApprovedTokenAmount] = useState(0);
  const [isTransferable, setIsTransferable] = useState(false);

  // Mảng các ví gửi cho Many-to-One
  const [senders, setSenders] = useState(['']);

  // THÊM STATE MỚI CHO AMOUNT
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State quản lý trạng thái tải
  const [formErrors, setFormErrors] = useState({});
  const [transactionError, setTransactionError] = useState(null); // State quản lý lỗi giao dịch

  useEffect(() => {
    const fetchTokenName = async (address) => {
      console.log('address', address);

      try {
        if (address === 'NATIVE_TOKEN') {
          setTokenName(`Native Token`);
          setTokenDecimals(18); // Giả sử native token có 18 chữ số thập phân
          setMultiCallContractAddress('');
          setApprovedTokenAmount(0);
          setIsTransferable(true);
        } else {
          const data = await tokenApi.getTokensByAddress(address, {});
          const multiCallContractAddressRes = await configApi.getConfigByKey(getMultiCallContractAddressKeyByChainId(chainId));
          setMultiCallContractAddress(multiCallContractAddressRes.value || '');
          setTokenName(data?.tokens[0]?.token_name || '');
          setTokenDecimals(data?.tokens[0]?.decimals || 0);
          setIsTransferable(false);
        }
      } catch (err) {
        setTokenName('Failed to load token name.');
        setTokenDecimals(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTokenName(tokenAddress);
  }, []);

  useEffect(() => {
    if (!chainId || !tokenAddress) {
      navigate('/finance/transfer');
    }
    setFormErrors({});
    // Reset amount khi chuyển mode hoặc khởi tạo trang
    setAmount('');
  }, [chainId, tokenAddress, navigate, transferMode]);

  const addReceiverInput = () => {
    setReceivers([...receivers, '']);
  };

  const removeReceiverInput = (indexToRemove) => {
    setReceivers(receivers.filter((_, index) => index !== indexToRemove));
    setFormErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[`receiver-${indexToRemove}`];
        return newErrors;
    });
  };

  const updateReceiverInput = (index, value) => {
    const newReceivers = [...receivers];
    newReceivers[index] = value;
    setReceivers(newReceivers);
  };

  const addSenderSelect = () => {
    setSenders([...senders, '']);
  };

  const removeSenderSelect = (indexToRemove) => {
    setSenders(senders.filter((_, index) => index !== indexToRemove));
    setFormErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[`sender-${indexToRemove}`];
        return newErrors;
    });
  };

  const updateSenderSelect = (index, value) => {
    const newSenders = [...senders];
    newSenders[index] = value;
    setSenders(newSenders);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // VALIDATION CHO AMOUNT
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than zero.';
      isValid = false;
    }

    if (transferMode === 'one_to_many') {
      if (!oneToManySender) {
        errors.oneToManySender = 'Please select a sender wallet.';
        isValid = false;
      }
      if (receivers.length === 0) {
        errors.noReceiver = 'Please add at least one receiver address.';
        isValid = false;
      } else {
        receivers.forEach((addr, index) => {
          if (!addr.trim()) {
            errors[`receiver-${index}`] = `Receiver address ${index + 1} cannot be empty.`;
            isValid = false;
          }
          // Thêm validation địa chỉ ví cụ thể ở đây
        });
      }
    } else if (transferMode === 'many_to_one') {
      if (senders.length === 0) {
        errors.noSender = 'Please add at least one sender wallet.';
        isValid = false;
      } else {
        senders.forEach((walletId, index) => {
          if (!walletId) {
            errors[`sender-${index}`] = `Please select sender wallet ${index + 1}.`;
            isValid = false;
          }
        });
      }
      if (!manyToOneReceiver.trim()) {
        errors.manyToOneReceiver = 'Receiver address cannot be empty.';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const canTransfer = async (transferAmount, allowanceAmountWei) => {
    try {
        const transferAmountWei = ethers.parseUnits(transferAmount.toString(), tokenDecimals);
        
        const isUnlimitedApproval = allowanceAmountWei.toString() === ethers.MaxUint256.toString();
        if (isUnlimitedApproval) {
            return true;
        }
      
        if (transferAmountWei > allowanceAmountWei) {
            return false;
        } else {
          return true;
        }
    } catch (error) {
        console.error(`Lỗi khi kiểm tra allowance: ${error.message}`);
        return false;
    }
  }

  const handleApprove = async () => {
    setTransactionError(null); // Reset lỗi giao dịch trước khi thử lại
  
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const amountValue = parseFloat(amount);
    const senderWalletData = await walletApi.getWalletById(oneToManySender, chainId);
    const senderAddress = senderWalletData.address;
    const isTransferableTmp = await canTransfer(amountValue, tokenAmountAllowance.allowanceAmountWei);
    if (!isTransferableTmp) {
      const approveTokenSpendingRes = await financeApi.approveTokenSpending(
        {
          fromWalletId: oneToManySender,
          tokenAddress: tokenAddress,
          spenderAddress: multiCallContractAddress,
          chainId: chainId
        }
      );
      if (approveTokenSpendingRes.success) {
        setIsTransferable(true);
      } else {
        setTransactionError(approveTokenSpendingRes.message || 'An unexpected error occurred while approving token spending.');
        setIsTransferable(false);
      }
      
    } else {
      setIsTransferable(true);
    }
    setIsLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTransactionError(null); // Reset lỗi giao dịch trước khi thử lại
  
    if (!validateForm()) {
      return; // Dừng nếu form không hợp lệ
    }
    setIsLoading(true);
    const isNativeToken = tokenAddress === 'NATIVE_TOKEN';
    const amountValue = parseFloat(amount);
    try {
      if (isNativeToken) {
          if (transferMode == 'one_to_many') {
            console.log({
              fromWalletId: oneToManySender,
              toWalletAddresses: receivers.filter(addr => addr.trim() !== ''),
              amount: amountValue,
              chainId: chainId
            });
            await financeApi.transferNativeCoinToMultiple({
              fromWalletId: oneToManySender,
              toWalletAddresses: receivers.filter(addr => addr.trim() !== ''),
              amount: amountValue.toString(),
              chainId: chainId
            });
          } else {
            await financeApi.transferNativeCoinFromMultiple({
              fromWalletIds: senders.filter(walletId => walletId !== ''),
              toWalletAddress: manyToOneReceiver,
              amount: amountValue,
              chainId: chainId
            });
          }
      } else {
        if (transferMode == 'one_to_many') {
          const senderWalletData = await walletApi.getWalletById(oneToManySender, chainId);
          const senderAddress = senderWalletData.address;
          const tokenAmountAllowance = await getTokenAmountAllowance(tokenAddress, chainId, senderAddress, multiCallContractAddress);
          const isTransferableTmp = await canTransfer(amountValue, tokenAmountAllowance.allowanceAmountWei);
          console.log('amountValue, tokenAmountAllowance.allowanceAmountWei', amountValue, tokenAmountAllowance.allowanceAmountWei);
          console.log('isTransferableTmp', isTransferableTmp);
          if (!isTransferableTmp) {
            setTransactionError('Cần cho phép trước khi chuyển.');
          } else {
            await financeApi.transferCustomCoinToMultiple({
              fromWalletId: oneToManySender,
              toWalletAddresses: receivers.filter(addr => addr.trim() !== ''),
              amount: formatPriceWithDecimals(amountValue.toString(), tokenDecimals),
              tokenAddress: tokenAddress,
              chainId: parseInt(chainId)
            });
          }
        }
      }
      console.log("Transfer successful!");
      // Điều hướng đến trang thành công hoặc hiển thị thông báo thành công
      navigate('/finance/success');

    } catch (err) {
      console.error("Transfer failed:", err);
      setTransactionError(err.message || 'An unexpected error occurred during transfer.');
    } finally {
      setIsLoading(false); // Kết thúc trạng thái tải
    }
    
  };

  const displayTokenName = tokenAddress === 'NATIVE_TOKEN'
    ? tokenName
    : (tokenAddress ? `${tokenName} (${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)})` : 'N/A');

  return (
    <div className={styles.pageContainer}>
       {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang thực hiện...</p>
        </div>
      )}
      <h1>Chuyển Khoản - Bước 3: Cáu hình giao dịch</h1>
      <p className={styles.summaryText}>
        Mạng: <strong>{getChainNameById(chainId).toUpperCase()}</strong> | Token: <strong>{displayTokenName}</strong>
      </p>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>1. Chọn loại giao dịch</h2>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="one_to_many"
              checked={transferMode === 'one_to_many'}
              onChange={() => setTransferMode('one_to_many')}
            />
            Chuyển từ một ví sang nhiều ví
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="many_to_one"
              checked={transferMode === 'many_to_one'}
              onChange={() => setTransferMode('many_to_one')}
            />
            Chuyển từ nhiều ví tới một ví
          </label>
        </div>

        <h2>2. Cấu hình ví chuyển, ví gửi</h2>

        {transferMode === 'one_to_many' && (
          <>
            <div className={styles.formGroup}>
              <WalletSelect
                label="Ví Chuyển"
                value={oneToManySender}
                onChange={setOneToManySender}
                placeholder="Chọn ví..."
                formErrors={formErrors.oneToManySender}
              />
              {/* {formErrors.oneToManySender && <p className={styles.errorMessage}>{formErrors.oneToManySender}</p>} */}
            </div>

            {/* <h3 className={styles.subHeading}>Ví nhận(s)</h3> */}
            {receivers.map((receiverAddress, index) => (
              <ReceiverInput
                key={index}
                index={index}
                value={receiverAddress}
                onChange={updateReceiverInput}
                onRemove={receivers.length > 1 ? removeReceiverInput : null}
                placeholder="Nhập ví gửi"
                formErrors={formErrors[`receiver-${index}`]}
              />
            ))}
            {formErrors.noReceiver && <p className={styles.errorMessage}>{formErrors.noReceiver}</p>}

            <button type="button" className={styles.addButton} onClick={addReceiverInput}>
              + Thêm ví nhận
            </button>
          </>
        )}

        {transferMode === 'many_to_one' && (
          <>
            {/* <h3 className={styles.subHeading}>Ví Chuyển(s)</h3> */}
            {senders.map((senderWalletId, index) => (
              <SenderSelect
                key={index}
                index={index}
                value={senderWalletId}
                onChange={updateSenderSelect}
                onRemove={senders.length > 1 ? removeSenderSelect : null}
                placeholder="Chọn ví..."
                formErrors={formErrors[`sender-${index}`]}
              />
            ))}
            {formErrors.noSender && <p className={styles.errorMessage}>{formErrors.noSender}</p>}

            <button type="button" className={styles.addButton} onClick={addSenderSelect}>
              + Thêm ví chuyển
            </button>

            <div className={styles.formGroup}>
              <label htmlFor="many-to-one-receiver" className={styles.label}>
                Ví nhận:
              </label>
              <input
                type="text"
                id="many-to-one-receiver"
                className={`${styles.inputField} ${formErrors.manyToOneReceiver ? styles.error : ''}`}
                placeholder="Enter the single receiver address"
                value={manyToOneReceiver}
                onChange={(e) => setManyToOneReceiver(e.target.value)}
              />
              {formErrors.manyToOneReceiver && <p className={styles.errorMessage}>{formErrors.manyToOneReceiver}</p>}
            </div>
          </>
        )}

        {/* THÊM TRƯỜNG INPUT CHO AMOUNT */}
        <h2 className={styles.subHeading}>3. Số lượng giao dịch</h2>
        <div className={styles.formGroup}>
          <label htmlFor="transfer-amount" className={styles.label}>
            Số lượng chuyển ({tokenName}):
          </label>
          <input
            type="text" // Sử dụng type="number" cho input số
            id="transfer-amount"
            className={`${styles.inputField} ${formErrors.amount ? styles.error : ''}`}
            placeholder="Enter amount to transfer"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {formErrors.amount && <p className={styles.errorMessage}>{formErrors.amount}</p>}
        </div>
        {transactionError && (
          <div className={styles.globalErrorMessage}>
            <p>Lỗi: {transactionError}</p>
            <p>Kiểm tra lại các cấu hình.</p>
          </div>
        )}
        <div className={styles.navigationButtons}>
          <button
            type="button"
            onClick={() => navigate(`/finance/transfer/chain/${chainId}`)}
            className={styles.prevButton}
            disabled={isLoading}
          >
            Quay lại
          </button>
          {!isTransferable && (
            <button type="button" disabled={isLoading} onClick={handleApprove} className={styles.nextButton}>
              {isLoading ? 'Đang xử lí...' : 'Cấp quyền chuyển khoản'}
            </button>
          )}
          {isTransferable && (
            <button type="submit" disabled={isLoading} className={styles.nextButton}>
            {isLoading ? 'Đang xử lí...' : 'Hoàn thành chuyển khoản'}
          </button>
          )}
          
        </div>
      </form>
    </div>
  );
};

export default SelectModeAndWalletTransferPage;