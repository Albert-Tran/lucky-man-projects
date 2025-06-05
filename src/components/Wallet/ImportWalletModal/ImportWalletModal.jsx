// src/components/ExportWalletModal.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import walletApi from '../../../services/api/walletApi';
import { validateRequired, composeValidators, validateMin } from '../../../utils/helpers/validators.js';
import styles from './ImportWalletModal.module.css';

const ImportWalletModal = ({ walletGroups, onClose, onExportSuccess }) => {
    const [privateKey, setPrivateKey] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [selectedGroupName, setSelectedGroupName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

  // Sử dụng useRef để tham chiếu đến nội dung modal
  const modalContentRef = useRef(null);

  // useEffect để thêm và xóa event listener cho click bên ngoài
    useEffect(() => {
        setFormErrors({}); // Reset form errors khi mở modal
        const handleClickOutside = (event) => {
        // Nếu click không nằm trong modal content, đóng modal
        if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
            onClose();
        }
        };

        // Thêm event listener khi component mount
        document.addEventListener('mousedown', handleClickOutside);

        // Xóa event listener khi component unmount
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]); // `onClose` là một dependency, đảm bảo hàm `handleClickOutside` được tạo lại nếu `onClose` thay đổi (ít khả năng)


    const validatePrivateKey = composeValidators(
      (value) => validateRequired(value, 'Khoá bí mật'),
    );
  
    const validateWalletGroupId = composeValidators(
      (value) => validateRequired(value, 'Nhóm Ví')
    );

    const validateForm = () => {
        setFormErrors(null);
        const errors = {};
        const privateKeyError = validatePrivateKey(privateKey);
        if (privateKeyError) errors.privateKey = privateKeyError;
        
        const walletGroupIdError = validateWalletGroupId(selectedGroupId);
        if (walletGroupIdError) errors.walletGroupId = walletGroupIdError;
        console.log(errors);
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImport = async () => { 
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await walletApi.importWallet({privateKey: privateKey, groupId: selectedGroupId});
            onExportSuccess(`Import ví thành công vào nhóm: ${selectedGroupName}`);
            onClose();
        } catch (err) {
        console.error('Error importing wallets:', err);
        setError(err?.message || 'Có lỗi trong quá trình import. Thử lại sau');
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className={styles.modalOverlay}>
      {/* Gán ref vào phần nội dung modal */}
      <div className={styles.modalContent} ref={modalContentRef}>
        <button className={styles.closeButton} onClick={onClose} disabled={loading}>
          &times; {/* Dấu 'x' cho nút đóng */}
        </button>
        <h3>Import Ví</h3>
        <p>Điền khoá bí mật và chọn nhóm ví trước khi ấn import</p>
        <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Khoá bí mật:</label>
            <input
                type="text"
                id="wallet_count"
                className={`${styles.input} ${formErrors.privateKey ? styles.inputError : ''}`}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                disabled={loading}
            />
            {formErrors.privateKey && <p className={styles.errorMessage}>{formErrors.privateKey}</p>}
            </div>
        <div className={styles.formGroup}>
          <label htmlFor="importGroup">Nhóm ví:</label>
          <select
            id="importGroup"
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value);
              setSelectedGroupName(e.target.options[e.target.selectedIndex].text)
            }}
          >
            <option value="">Chọn nhóm</option>
            {walletGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {formErrors.walletGroupId && <p className={styles.errorMessage}>{formErrors.walletGroupId}</p>}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button onClick={handleImport} disabled={loading}>
            {loading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportWalletModal;