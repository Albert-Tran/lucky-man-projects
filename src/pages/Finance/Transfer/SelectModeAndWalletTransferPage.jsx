// src/pages/TransferFinalStepPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WalletSelect from '../../../components/Wallet/WalletSelect/WalletSelect.jsx'; // Component chọn ví (cho sender mặc định 1-Many)
import ReceiverInput from '../../../components/Finance/ReceiverInput/ReceiverInput.jsx'; // Input cho người nhận (One-to-Many)
import SenderSelect from '../../../components/Finance/SenderSelect/SenderSelect.jsx';   // Select cho người gửi (Many-to-One)
import styles from './TransferPage.module.css'; // Tái sử dụng CSS
import financeApi from '../../../services/api/financeApi.js';

const SelectModeAndWalletTransferPage = () => {
  const { chainId, tokenAddress } = useParams();
  const navigate = useNavigate();

  const [transferMode, setTransferMode] = useState('one_to_many');
  const [oneToManySender, setOneToManySender] = useState('');
  const [manyToOneReceiver, setManyToOneReceiver] = useState('');

  // Mảng các ví nhận cho One-to-Many
  const [receivers, setReceivers] = useState(['']);

  // Mảng các ví gửi cho Many-to-One
  const [senders, setSenders] = useState(['']);

  // THÊM STATE MỚI CHO AMOUNT
  const [amount, setAmount] = useState('');

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!chainId || !tokenAddress) {
      navigate('/');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        chainId,
        tokenAddress,
        transferMode,
        amount: parseFloat(amount), // Chuyển đổi amount sang số
      };

      if (transferMode === 'one_to_many') {
        payload.senderWallet = oneToManySender;
        payload.receiverAddresses = receivers.filter(addr => addr.trim() !== '');
      } else if (transferMode === 'many_to_one') {
        payload.senderWallets = senders.filter(walletId => walletId !== '');
        payload.receiverAddress = manyToOneReceiver;
      }
      await financeApi.transfer(payload);
      console.log('Final Transfer Payload:', payload);
      alert('Transfer initiated! (Check console for details)');
      // Thực hiện gọi API transfer thực tế ở đây
      // navigate('/success');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Wallet Transfer - Step 3: Configure Transfer</h1>
      <p className={styles.summaryText}>
        Chain: <strong>{chainId.toUpperCase()}</strong> | Token: <strong>{tokenAddress ? `${tokenAddress.substring(0, 6)}...${tokenAddress.substring(tokenAddress.length - 4)}` : 'N/A'}</strong>
      </p>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>1. Select Transfer Mode</h2>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="one_to_many"
              checked={transferMode === 'one_to_many'}
              onChange={() => setTransferMode('one_to_many')}
            />
            One to Many (1 Sender, Many Receivers)
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="many_to_one"
              checked={transferMode === 'many_to_one'}
              onChange={() => setTransferMode('many_to_one')}
            />
            Many to One (Many Senders, 1 Receiver)
          </label>
        </div>

        <h2>2. Configure Wallets</h2>

        {transferMode === 'one_to_many' && (
          <>
            <div className={styles.formGroup}>
              <WalletSelect
                label="Sender Wallet"
                value={oneToManySender}
                onChange={setOneToManySender}
                placeholder="Select a wallet to send from..."
                formErrors={formErrors.oneToManySender}
              />
              {formErrors.oneToManySender && <p className={styles.errorMessage}>{formErrors.oneToManySender}</p>}
            </div>

            <h3 className={styles.subHeading}>Receiver Addresses</h3>
            {receivers.map((receiverAddress, index) => (
              <ReceiverInput
                key={index}
                index={index}
                value={receiverAddress}
                onChange={updateReceiverInput}
                onRemove={receivers.length > 1 ? removeReceiverInput : null}
                placeholder="Enter receiver address"
                formErrors={formErrors[`receiver-${index}`]}
              />
            ))}
            {formErrors.noReceiver && <p className={styles.errorMessage}>{formErrors.noReceiver}</p>}

            <button type="button" className={styles.addButton} onClick={addReceiverInput}>
              + Add Receiver
            </button>
          </>
        )}

        {transferMode === 'many_to_one' && (
          <>
            <h3 className={styles.subHeading}>Sender Wallets</h3>
            {senders.map((senderWalletId, index) => (
              <SenderSelect
                key={index}
                index={index}
                value={senderWalletId}
                onChange={updateSenderSelect}
                onRemove={senders.length > 1 ? removeSenderSelect : null}
                placeholder="Select a wallet to send from..."
                formErrors={formErrors[`sender-${index}`]}
              />
            ))}
            {formErrors.noSender && <p className={styles.errorMessage}>{formErrors.noSender}</p>}

            <button type="button" className={styles.addButton} onClick={addSenderSelect}>
              + Add Sender
            </button>

            <div className={styles.formGroup}>
              <label htmlFor="many-to-one-receiver" className={styles.label}>
                Receiver Address:
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
        <h2 className={styles.subHeading}>3. Transfer Amount</h2>
        <div className={styles.formGroup}>
          <label htmlFor="transfer-amount" className={styles.label}>
            Amount:
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

        <div className={styles.navigationButtons}>
          <button
            type="button"
            onClick={() => navigate(`/finance/transfer/chain/${chainId}`)}
            className={styles.prevButton}
          >
            Previous
          </button>
          <button type="submit" className={styles.nextButton}>
            Complete Transfer
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelectModeAndWalletTransferPage;