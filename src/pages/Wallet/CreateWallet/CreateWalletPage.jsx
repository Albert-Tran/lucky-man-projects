// src/pages/WalletGroups/CreateWalletGroupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletForm from '../../../components/Wallet/WalletForm/WalletForm.jsx';
import walletApi from '../../../services/api/walletApi.js';
import styles from './CreateWalletPage.module.css';

const CreateWalletGroupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [walletGroups, setWalletGroups] = useState([]);
    const [isFetchingWalletGroups, setIsFetchingWalletGroups] = useState(true);
    const [fetchingWalletGroupsError, setFetchingWalletGroupsError] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWalletGroups = async () => {
            setIsFetchingWalletGroups(true);
            setFetchingWalletGroupsError(null);
            try {
                const data = await walletApi.getWalletGroups({});
                const formattedGroups = data.groups.map(group => ({
                    value: group.id,
                    label: group.name
                }));
                setWalletGroups(formattedGroups);
            } catch (err) {
                console.error('Error fetching wallet groups:', err);
                setFetchingWalletGroupsError('Có vấn đề khi tải nhóm ví. Thử lại sau.');
            } finally {
                setIsFetchingWalletGroups(false);
            }
        };

        fetchWalletGroups();
    }, []);

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);
        console.log(formData);
        try {
            await walletApi.createWallet(formData);
            alert('Ví đã được tạo thành công!');
            navigate('/wallet');
        } catch (err) {
            setError(err.message || 'Không thể tạo ví. Vui lòng thử lại.');
            console.error('Error creating wallet group:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Tạo Ví Mới</h1>
        <WalletForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            isFetchingWalletGroups={isFetchingWalletGroups}
            fetchingWalletGroupsError={fetchingWalletGroupsError}
            walletGroups={walletGroups}
            initialData={{}}
            buttonText="Tạo Ví"
        />
        </div>
    );
};

export default CreateWalletGroupPage;