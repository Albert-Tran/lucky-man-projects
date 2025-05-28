import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WalletGroupManagerPage.module.css';
import WalletGroupCard from '../../../components/Wallet/WalletGroups/WalletGroupCard/WalletGroupCard.jsx';
import LoadingSpinner from '../../../components/Common/LoadingSpinner/LoadingSpinner.jsx';
import walletApi from '../../../services/api/walletApi.js';

const WalletGroupManagerPage = () => {
    const [walletGroups, setWalletGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGroupIds, setSelectedGroupIds] = useState(new Set()); // Dùng Set để quản lý ID đã chọn
    const [isMasterCheckboxChecked, setIsMasterCheckboxChecked] = useState(false); // Trạng thái checkbox "Chọn tất cả"
    const navigate = useNavigate();

    const fetchWalletGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await walletApi.getWalletGroups();
            setWalletGroups(data);
            // Reset selected items and master checkbox when groups are re-fetched
            setSelectedGroupIds(new Set());
            setIsMasterCheckboxChecked(false);
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách nhóm ví.');
            console.error('Failed to fetch wallet groups:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletGroups();
    }, [fetchWalletGroups]);

    const handleMasterCheckboxChange = () => {
        if (isMasterCheckboxChecked) {
            setSelectedGroupIds(new Set()); // Bỏ chọn tất cả
        } else {
            const allGroupIds = new Set(walletGroups.map(group => group.id));
            setSelectedGroupIds(allGroupIds); // Chọn tất cả
        }
        setIsMasterCheckboxChecked(!isMasterCheckboxChecked);
    };

    useEffect(() => {
        setIsMasterCheckboxChecked(
            walletGroups.length > 0 && selectedGroupIds.size === walletGroups.length
        );
    }, [selectedGroupIds, walletGroups]);

    const handleAddGroup = () => {
        navigate('wallet/wallet-groups/new');
    };

    const handleEditGroup = (groupId) => {
        navigate(`wallet/wallet-groups/${groupId}/edit`);
    };

    const handleSelectGroup = (groupId) => {
        setSelectedGroupIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(groupId)) {
            newSet.delete(groupId);
        } else {
            newSet.add(groupId);
        }
        return newSet;
        });
    };

    const handleDeleteGroup = async (groupId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhóm ví này không?')) {
        setLoading(true); // Có thể dùng loading riêng cho action này
        setError(null);
        try {
            await walletApi.deleteWalletGroups([groupId]);
            alert('Nhóm ví đã được xóa thành công!');
            fetchWalletGroups(); // Tải lại danh sách
        } catch (err) {
            setError(err.message || 'Không thể xóa nhóm ví.');
            console.error('Failed to delete group:', err);
        } finally {
            setLoading(false);
        }
        }
    };

    const handleMassDelete = async () => {
        if (selectedGroupIds.size === 0) {
        alert('Vui lòng chọn ít nhất một nhóm để xóa.');
        return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedGroupIds.size} nhóm ví đã chọn không?`)) {
        setLoading(true);
        setError(null);
        try {
            const idsToDelete = Array.from(selectedGroupIds); // Chuyển Set thành Array
            await walletApi.deleteWalletGroups(idsToDelete);
            alert('Các nhóm ví đã được xóa thành công!');
            fetchWalletGroups(); // Tải lại danh sách
        } catch (err) {
            setError(err.message || 'Không thể xóa các nhóm ví đã chọn.');
            console.error('Failed to mass delete groups:', err);
        } finally {
            setLoading(false);
        }
        }
    };

    if (loading) {
        return (
        <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Đang tải danh sách nhóm ví...</p>
        </div>
        );
    }
    
    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    return (
        <div className={styles.layoutContainer}>
            <h1 className={styles.pageTitle}>Quản lý Nhóm Ví</h1>

            <div className={styles.topActions}>
                <button onClick={handleAddGroup} className={styles.addButton}>
                + Thêm Nhóm Mới
                </button>
                {selectedGroupIds.size > 0 && (
                <div className={styles.massActions}>
                    <input
                    type="checkbox"
                    checked={isMasterCheckboxChecked}
                    onChange={handleMasterCheckboxChange}
                    className={styles.masterCheckbox}
                    />
                    <label htmlFor="master-select-all" className={styles.masterCheckboxLabel}>
                    Chọn tất cả ({selectedGroupIds.size}/{walletGroups.length})
                    </label>
                    <button onClick={handleMassDelete} className={styles.deleteSelectedButton}>
                    Xóa ({selectedGroupIds.size})
                    </button>
                </div>
                )}
            </div>

            {walletGroups.length === 0 ? (
                <p className={styles.noGroupsMessage}>Chưa có nhóm ví nào. Hãy thêm một nhóm mới!</p>
            ) : (
                <div className={styles.gridContainer}>
                {walletGroups.map(group => (
                    <WalletGroupCard
                        key={group.id}
                        group={group}
                        isSelected={selectedGroupIds.has(group.id)}
                        onSelect={handleSelectGroup}
                        onEdit={handleEditGroup}
                        onDelete={handleDeleteGroup}
                    />
                ))}
                </div>
            )}
        </div>
  );
};

export default WalletGroupManagerPage;