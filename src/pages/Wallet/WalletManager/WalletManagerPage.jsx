import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import walletApi from '../../../services/api/walletApi.js';
import LoadingSpinner from '../../../components/Common/LoadingSpinner/LoadingSpinner.jsx';
import ExportWalletModal from '../../../components/Wallet/ExportWalletModal/ExportWalletModal.jsx';
import styles from './WalletManagerPage.module.css'; // Import CSS riêng cho trang này
import Pagination from '../../../components/Common/Pagination/Pagination.jsx';
import CONFIG from '../../../utils/config/config.js';

const ITEMS_PER_PAGE_OPTIONS = CONFIG[import.meta.env.VITE_MODE].ITEMS_PER_PAGE_OPTIONS;

const WalletManagerPage = () => {
    const [wallets, setWallets] = useState([]);
    const [walletGroups, setWalletGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showExportModal, setShowExportModal] = useState(false);
    const [message, setMessage] = useState("");
    
    const navigate = useNavigate();

    // States cho các bộ lọc
    const [filterChain, setFilterChain] = useState(0);
    const [filterName, setFilterName] = useState('');
    const [filterAddress, setFilterAddress] = useState('');

    // State mới cho các wallet đã chọn để xóa hàng loạt
    const [selectedWalletIds, setSelectedWalletIds] = useState(new Set()); // Sử dụng Set để lưu trữ ID duy nhất


    // Hàm fetch wallet - BÂY GIỜ SẼ KHÔNG CẦN THAM SỐ FILTER NỮA NẾU LỌC FRONTEND
    const fetchWallets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSelectedWalletIds(new Set()); // Reset các lựa chọn khi tải lại dữ liệu
        try {
            const filter ={limit: itemsPerPage, page: currentPage };
            const data = await walletApi.getWallets(filter); // Lấy tất cả từ backend
            console.log('Fetched wallets:', data.wallets); // Log dữ liệu để kiểm tra
            const walletGroupRes = await walletApi.getWalletGroups();
             // Lưu trữ nhóm ví nếu cần
            setWallets(data.wallets || []); // Cập nhật danh sách ví
            setWalletGroups(walletGroupRes.groups || []);
            setTotalItems(data.total || 0);
            const calculatedTotalPages = Math.ceil((data.total || 0) / itemsPerPage);
            setTotalPages(calculatedTotalPages); // Cập nhật tổng số trang
            if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
                setCurrentPage(calculatedTotalPages); // <--- Điều này sẽ thay đổi state currentPage
            } else if (calculatedTotalPages === 0 && currentPage !== 1) {
            // Nếu không có mục nào và bạn không ở trang 1, chuyển về trang 1
            setCurrentPage(1); // <--- Điều này cũng sẽ thay đổi state currentPage
            }
        } catch (err) {
        setError(err.message || 'Không thể tải danh sách wallet.');
        console.error('Error fetching wallets:', err);
        } finally {
        setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, filterChain, filterName, filterAddress]);

  // Gọi fetchWallets khi component mount
  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [message]);

  // Logic chọn/bỏ chọn một wallet
  const handleToggleSelectWallet = (walletId) => {
      setSelectedWalletIds(prevSelected => {
          const newSelected = new Set(prevSelected);
          if (newSelected.has(walletId)) {
          newSelected.delete(walletId);
          } else {
          newSelected.add(walletId);
          }
          return newSelected;
      });
  };

  const getWalletGroupNameById = (groupId) => {
      const group = walletGroups.find(g => g.id === groupId);
      return group ? group.name : 'Không có nhóm';
  };

  // Logic chọn/bỏ chọn tất cả các wallet hiển thị
  const handleToggleSelectAll = () => {
      if (selectedWalletIds.size === wallets.length && wallets.length > 0) {
          // Nếu tất cả đang được chọn, bỏ chọn tất cả
          setSelectedWalletIds(new Set());
      } else {
          // Chọn tất cả các wallet hiển thị
          const allFilteredWalletIds = new Set(wallets.map(wallet => wallet.id));
          setSelectedWalletIds(allFilteredWalletIds);
      }
  };

  // Kiểm tra xem tất cả wallet hiển thị có đang được chọn không
  const isAllSelected = wallets.length > 0 && selectedWalletIds.size === wallets.length;

  const handleAddWallet = () => {
      navigate('/wallet/new');
  };

  const handlePageChange = (pageNumber) => {
      if (pageNumber > 0 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
      }
  };

  const handleItemsPerPageChange = (e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
  };

  const handleDeleteWallet = async (walletId, walletAddress) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa wallet "${walletAddress}" không?`)) {
        setIsLoading(true);
        setError(null);
        try {
        await walletApi.deleteWalletById(walletId);
        alert('Wallet đã được xóa thành công!');
        fetchWallets(); // Tải lại danh sách sau khi xóa, reset filters
        } catch (err) {
        setError(err.message || 'Không thể xóa wallet.');
        console.error('Error deleting wallet:', err);
        } finally {
        setIsLoading(false);
        }
    }
  };

  // Hàm xử lý xóa nhiều wallet
  const handleDeleteSelectedWallets = async () => {
    if (selectedWalletIds.size === 0) {
      alert('Vui lòng chọn ít nhất một wallet để xóa.');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedWalletIds.size} wallet đã chọn không?`)) {
      setIsLoading(true);
      setError(null);
      try {
        const idsToDelete = Array.from(selectedWalletIds); // Chuyển Set thành Array
        await walletApi.deleteMultipleWallets(idsToDelete);
        alert(`${selectedWalletIds.size} wallet đã được xóa thành công!`);
        fetchWallets(); // Tải lại danh sách sau khi xóa hàng loạt
      } catch (err) {
        setError(err.message || 'Không thể xóa các wallet đã chọn.');
        console.error('Error deleting selected wallets:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportSuccess = (msg) => {
    setMessage(msg);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Đang tải danh sách ví...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Quản Lý Ví</h1>
      {message && <p className={styles.messageSuccess}>{message}</p>}
      <div className={styles.actionBar}>
        {/* Filter Controls */}
        <div className={styles.filterControls}>
            {/* TODO: Thêm các bộ lọc nếu cần */}
        </div>

        {/* Mass Action and Add Button */}
        <div className={styles.actionButtons}>
          {selectedWalletIds.size > 0 && (
            <button
              className={styles.massDeleteButton} // Sẽ thêm style này vào CSS
              onClick={handleDeleteSelectedWallets}
              disabled={isLoading}
            >
              Xóa ({selectedWalletIds.size}) mục đã chọn
            </button>
          )}
          <button className={styles.addButton} onClick={handleAddWallet}>
            Thêm Ví Mới
          </button>
          <button className={styles.importButton} onClick={handleAddWallet}>
            Import Vi
          </button>
          <button className={styles.exportButton} onClick={() => setShowExportModal(true)}>Export Vi</button>
        </div>
      </div>

      {showExportModal && (
        <ExportWalletModal
          walletGroups={walletGroups}
          onClose={() => setShowExportModal(false)} // Hàm đóng modal
          onExportSuccess={handleExportSuccess} // Hàm xử lý thành công
        />
      )}

      {wallets.length === 0 ? (
        <p className={styles.noDataMessage}>
          {wallets.length === 0 ? 'Chưa có wallet nào trên hệ thống.' : 'Không tìm thấy wallet nào phù hợp với bộ lọc.'}
        </p>
      ) : (
        <>
            <div className={styles.tableResponsive}>
            <table className={styles.walletTable}>
                <thead>
                <tr>
                    <th>
                    <input
                        type="checkbox"
                        className={styles.selectAllCheckbox}
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        disabled={isLoading || wallets.length === 0}
                    />
                    </th>
                    <th>Địa chỉ Ví</th>
                    <th>Group</th>
                    <th>Native Balance</th>
                    <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {wallets.map((wallet) => (
                    <tr key={wallet.id}>
                    {/* Checkbox cho từng hàng */}
                    <td>
                        <input
                        type="checkbox"
                        className={styles.selectItemCheckbox}
                        checked={selectedWalletIds.has(wallet.id)}
                        onChange={() => handleToggleSelectWallet(wallet.id)}
                        disabled={isLoading}
                        />
                    </td>
                    <td className={styles.addressCell}>
                        <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.addressLink}
                        >
                        {wallet.address?.substring(0, 6)}...{wallet.address?.substring(wallet.address.length - 4)}
                        </a>
                    </td>
                    <td>{getWalletGroupNameById(wallet.group_id)}</td>
                    <td>{wallet.native_balance}</td>
                    <td className={styles.actionsCell}>
                        <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteWallet(wallet.id, wallet.address)}
                        >
                        Xóa
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
        </>
      )}
    </div>
  );
};

export default WalletManagerPage;