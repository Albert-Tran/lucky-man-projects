// src/components/ExportWalletModal.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import walletApi from '../../../services/api/walletApi';
import { validateRequired } from '../../../utils/helpers/validators.js';
import styles from './ExportWalletModal.module.css';

const ExportWalletModal = ({ walletGroups, onClose, onExportSuccess }) => {
  const [selectedGroupId, setSelectedGroupId] = useState(0);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  // Sử dụng useRef để tham chiếu đến nội dung modal
  const modalContentRef = useRef(null);

  // useEffect để thêm và xóa event listener cho click bên ngoài
  useEffect(() => {
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


  const handleExport = async () => {
    setFormError(null);
    const error = validateRequired(selectedGroupId, 'Nhóm ví');
    
    if (error) {
      setFormError(error);
      return;
    }
    setLoading(true);
    setError(null);
    try {
        const response = await walletApi.exportWallets({groupId: selectedGroupId});
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `wallets_group_${selectedGroupName}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        onExportSuccess(`Export thành công các ví của nhóm: ${selectedGroupName}`);
        onClose();
    } catch (err) {
      console.error('Error exporting wallets:', err);
      setError(err.response?.data?.message || 'Có lỗi trong quá trình export. Thử lại sau');
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
        <h3>Export Ví</h3>
        <p>Chọn một nhóm để export</p>

        <div className={styles.formGroup}>
          <label htmlFor="exportGroup">Nhóm ví:</label>
          <select
            id="exportGroup"
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value);
              setSelectedGroupName(e.target.options[e.target.selectedIndex].text)
              setFormError(null);
            }}
          >
            <option value="">Chọn nhóm</option>
            {walletGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {formError && <p className={styles.errorMessage}>{formError}</p>}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button onClick={handleExport} disabled={loading}>
            {loading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportWalletModal;