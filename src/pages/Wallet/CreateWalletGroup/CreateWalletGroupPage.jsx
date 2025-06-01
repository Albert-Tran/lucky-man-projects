// src/pages/WalletGroups/CreateWalletGroupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletGroupForm from '../../../components/Wallet/WalletGroups/WalletGroupForm/WalletGroupForm.jsx';
import walletApi from '../../../services/api/walletApi.js';
import styles from './CreateWalletGroupPage.module.css';

const CreateWalletGroupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);
        console.log(formData);
        try {
            await walletApi.createWalletGroup(formData);
            alert('Nhóm ví đã được tạo thành công!');
            navigate('/wallet/wallet-group');
        } catch (err) {
            setError(err.message || 'Không thể tạo nhóm ví. Vui lòng thử lại.');
            console.error('Error creating wallet group:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Tạo Nhóm Ví Mới</h1>
        <WalletGroupForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            buttonText="Tạo Nhóm Ví"
        />
        </div>
    );
};

export default CreateWalletGroupPage;