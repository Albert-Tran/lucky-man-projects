// src/pages/SwapFinalStepPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Không cần CustomLoadMoreSelect ở đây nữa vì token đã được chọn ở bước trước
import WalletAmountInput from '../../../components/Wallet/WalletAmountInput/WalletAmountInput.jsx'; // Import component mới
import {getChainNameById, getNativeTokenAddressByChainId} from '../../../utils/helpers/getConfig.js';
import styles from './SwapPage.module.css'; // Style chung của trang
import financeApi from '../../../services/api/financeApi.js'; // API của bạn
import tokenApi from '../../../services/api/tokenApi.js';

const SelectWalletAndAmountSwapPage = () => {
    // Lấy chainId, mode và tokenAddress từ URL params
    const { chainId, mode, tokenAddress } = useParams();
    const navigate = useNavigate();

    // State để lưu trữ danh sách các cặp { wallet, amount }
    const [swapPairs, setSwapPairs] = useState([{ wallet: '', amount: '' }]);
    const [tokenName, setTokenName] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // State quản lý trạng thái tải
    const [transactionError, setTransactionError] = useState(null); // State quản lý lỗi giao dịch
    const [minAmountOut, setMinAmountOut] = useState('');

    useEffect(() => {
        const fetchTokenName = async (address) => {
        console.log('address', address);

        try {
            const data = await tokenApi.getTokensByAddress(address, {});
            setTokenName(data?.tokens[0]?.token_name || '');
        } catch (err) {
            setTokenName('Failed to load token name.');
        } finally {
            setIsLoading(false);
        }
        };
        fetchTokenName(tokenAddress);
    }, []);

    // Effect để kiểm tra params và reset form khi tải trang hoặc params thay đổi
    useEffect(() => {
        if (!chainId || !mode || !['token_to_native', 'native_to_token'].includes(mode) || !tokenAddress) {
        // Điều hướng về trang chọn mode nếu bất kỳ param nào thiếu hoặc không hợp lệ
        navigate(`/finance/swap/chain/${chainId || ''}`);
        }
        setFormErrors({});
        setTransactionError(null);
        setSwapPairs([{ wallet: '', amount: '' }]); // Reset danh sách cặp khi chain/mode/token thay đổi
    }, [chainId, mode, tokenAddress, navigate]);

    // Thêm một cặp ví/số lượng mới vào danh sách
    const addSwapPair = () => {
        setSwapPairs([...swapPairs, { wallet: '', amount: '' }]);
    };

    // Xóa một cặp ví/số lượng theo index
    const removeSwapPair = (indexToRemove) => {
        setSwapPairs(swapPairs.filter((_, index) => index !== indexToRemove));
        setFormErrors(prevErrors => { // Xóa lỗi tương ứng khi khối bị xóa
            const newErrors = { ...prevErrors };
            delete newErrors[`wallet-${indexToRemove}`];
            delete newErrors[`amount-${indexToRemove}`];
            return newErrors;
        });
    };

    // Cập nhật giá trị ví cho một cặp cụ thể
    const updateWallet = (index, value) => {
        const newPairs = [...swapPairs];
        newPairs[index].wallet = value;
        setSwapPairs(newPairs);
    };

    // Cập nhật giá trị số lượng cho một cặp cụ thể
    const updateAmount = (index, value) => {
        const newPairs = [...swapPairs];
        newPairs[index].amount = value;
        setSwapPairs(newPairs);
    };

    // Hàm validate form trước khi submit
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (swapPairs.length === 0) {
            errors.noSwapPair = 'Please add at least one wallet and amount to swap.';
            isValid = false;
        } else {
            swapPairs.forEach((pair, index) => {
                if (!pair.wallet) {
                errors[`wallet-${index}`] = `Wallet ${index + 1} cannot be empty.`;
                isValid = false;
                }
                const parsedAmount = parseFloat(pair.amount);
                if (!pair.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
                errors[`amount-${index}`] = `Amount ${index + 1} must be a positive number.`;
                isValid = false;
                }
            });
            }

            setFormErrors(errors);
        return isValid;
    };

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setTransactionError(null);

        if (!validateForm()) {
        return;
        }

        setIsLoading(true);

        try {
            const wallets = swapPairs.map(pair => pair.wallet);
            const amounts = swapPairs.map(pair => pair.amount);
            if (mode === 'token_to_native') {
                await financeApi.swapTokensToNative({
                    fromWalletIds: wallets,
                    fromAmounts: amounts,
                    minAmountOut,
                    path: [
                        tokenAddress,
                        getNativeTokenAddressByChainId(chainId)
                    ],
                    chainId
                    
                });
                alert('Token to Native swap initiated successfully!');

            } else if (mode === 'native_to_token') {
                // Nếu là Native to Token, không cần bước approve
                await financeApi.swapNativeToTokens({
                    toWalletIds: wallets,
                    amounts,
                    minAmountOut,
                    path: [
                        getNativeTokenAddressByChainId(chainId),
                        tokenAddress
                    ],
                    chainId
                });
                alert('Native to Token swap initiated successfully!');
            }
            // Điều hướng đến trang thành công hoặc hiển thị thông báo thành công
            navigate('/finance/success');

        } catch (err) {
            console.error("Swap failed:", err);
            setTransactionError(err.response?.data?.message || err.message || 'An unexpected error occurred during swap.');
        } finally {
            setIsLoading(false); // Kết thúc trạng thái tải
        }
    };

    const displayMode = mode === 'token_to_native' ? 'Token to Native' : 'Native to Token';
    const displayTokenName = tokenAddress === 'NATIVE_TOKEN'
        ? 'Native Token'
        : (tokenAddress ? `${tokenName} (${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)})` : 'N/A');

    return (
        <div className={styles.pageContainer}>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner}></div>
                <p>Processing swap...</p>
                </div>
            )}

            <h1>Swap - Step 3: Configure Wallets & Amounts</h1>
            <p className={styles.summaryText}>
                Chain: <strong>{getChainNameById(chainId).toUpperCase()}</strong> | Mode: <strong>{displayMode}</strong> | Token: <strong>{displayTokenName}</strong>
            </p>

            <form onSubmit={handleSubmit} className={styles.formSection}>
                <h2 className={styles.subHeading}>1. Configure Swap Details</h2>
                {formErrors.noSwapPair && <p className={styles.errorMessage}>{formErrors.noSwapPair}</p>}
                <div className={styles.formGroup}>
                    <label htmlFor="transfer-amount" className={styles.label}>
                        Min Amount Out:
                    </label>
                    <input
                        type="text" // Sử dụng type="number" cho input số
                        id="transfer-amount"
                        className={`${styles.inputField} ${formErrors.minAmountOut ? styles.error : ''}`}
                        placeholder="Enter min amount out"
                        value={minAmountOut}
                        onChange={(e) => setMinAmountOut(e.target.value)}
                    />
                    {formErrors.amount && <p className={styles.errorMessage}>{formErrors.amount}</p>}
                </div>
                <h2 className={styles.subHeading}>2. Configure Swap Details</h2>
                {swapPairs.map((pair, index) => (
                <WalletAmountInput
                    key={index} // Key duy nhất cho mỗi khối
                    index={index}
                    walletValue={pair.wallet}
                    amountValue={pair.amount}
                    onWalletChange={updateWallet}
                    onAmountChange={updateAmount}
                    // Chỉ hiển thị nút xóa nếu có nhiều hơn một cặp
                    onRemove={swapPairs.length > 1 ? removeSwapPair : null}
                    walletPlaceholder="Select wallet"
                    amountPlaceholder="Enter amount to swap"
                    walletErrors={formErrors[`wallet-${index}`]}
                    amountErrors={formErrors[`amount-${index}`]}
                    isDisabled={isLoading} // Vô hiệu hóa input khi đang tải
                />
                ))}

                <button type="button" className={styles.addButton} onClick={addSwapPair} disabled={isLoading}>
                + Add New Wallet & Amount
                </button>

                {transactionError && (
                <div className={styles.globalErrorMessage}>
                    <p>Error: {transactionError}</p>
                    <p>Please check your inputs and try again.</p>
                </div>
                )}

                <div className={styles.navigationButtons}>
                <button
                    type="button"
                    // Quay về trang chọn mode và token
                    onClick={() => navigate(`/finance/swap/chain/${chainId}`)}
                    className={styles.prevButton}
                    disabled={isLoading}
                >
                    Previous
                </button>
                <button type="submit" className={styles.nextButton} disabled={isLoading}>
                    {isLoading ? 'Processing Swap...' : 'Complete Swap'}
                </button>
                </div>
            </form>
        </div>
    );
};

export default SelectWalletAndAmountSwapPage;