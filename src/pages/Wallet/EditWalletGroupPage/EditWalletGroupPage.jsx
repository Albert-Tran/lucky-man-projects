import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WalletGroupForm from '../../../components/Wallet/WalletGroups/WalletGroupForm/WalletGroupForm.jsx';
import walletApi from '../../../services/api/walletApi.js';
import LoadingSpinner from '../../../components/Common/LoadingSpinner/LoadingSpinner.jsx';
import styles from './EditWalletGroupPage.module.css'; // Dùng chung style cho trang form

const EditWalletGroupPage = () => {
  const { id } = useParams(); // Lấy groupId từ URL
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

    const fetchWalletGroupData = useCallback(async () => {
    setLoadingInitialData(true);
    setFetchError(null);
    try {
        const data = await walletApi.getWalletGroupById(id);
        setInitialData(data);
    } catch (err) {
        setFetchError(err.message || 'Không thể tải thông tin nhóm ví.');
        console.error('Error fetching wallet group:', err);
    } finally {
        setLoadingInitialData(false);
    }
    }, [id]);

  useEffect(() => {
    fetchWalletGroupData();
  }, [fetchWalletGroupData]);

  const handleSubmit = async (formData) => {
    setLoadingSubmit(true);
    setError(null);
    try {
      await walletApi.updateWalletGroup(id, formData);
      alert('Thông tin nhóm ví đã được cập nhật thành công!');
      navigate('/wallet/wallet-groups'); // Chuyển hướng về trang danh sách
    } catch (err) {
      setError(err.message || 'Không thể cập nhật nhóm ví. Vui lòng thử lại.');
      console.error('Error updating wallet group:', err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingInitialData) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Đang tải thông tin nhóm ví...</p>
      </div>
    );
  }

  if (fetchError) {
    return <div className={styles.errorContainer}>{fetchError}</div>;
  }

  if (!initialData) {
    return <div className={styles.errorContainer}>Không tìm thấy nhóm ví này.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Chỉnh Sửa Nhóm Ví</h1>
      <WalletGroupForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={loadingSubmit}
        error={error}
        buttonText="Cập Nhật Nhóm Ví"
      />
    </div>
  );
};

export default EditWalletGroupPage;