import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenApi from '../../../services/api/tokenApi.js';
import LoadingSpinner from '../../../components/Common/LoadingSpinner/LoadingSpinner.jsx';
import styles from './TokenManagerPage.module.css'; // Import CSS riêng cho trang này
import Pagination from '../../../components/Common/Pagination/Pagination.jsx';
import {getTokenAddressUrls, getChainNameById} from '../../../services/blockchain/evm/tokenFetcher.js';
import CONFIG from '../../../utils/config/config.js';

const ITEMS_PER_PAGE_OPTIONS = CONFIG[import.meta.env.VITE_MODE].ITEMS_PER_PAGE_OPTIONS;
const SUPPORTED_CHAINS = CONFIG[import.meta.env.VITE_MODE].SUPPORTED_CHAINS;

const FILTER_CHAINS = [
  { value: 0, label: 'Tất cả Chains' },
  ...SUPPORTED_CHAINS
];

const TokenManagerPage = () => {
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    // States cho các bộ lọc
    const [filterChain, setFilterChain] = useState(0);
    const [filterName, setFilterName] = useState('');
    const [filterAddress, setFilterAddress] = useState('');

    // State mới cho các token đã chọn để xóa hàng loạt
    const [selectedTokenIds, setSelectedTokenIds] = useState(new Set()); // Sử dụng Set để lưu trữ ID duy nhất


    // Hàm fetch token - BÂY GIỜ SẼ KHÔNG CẦN THAM SỐ FILTER NỮA NẾU LỌC FRONTEND
    const fetchTokens = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSelectedTokenIds(new Set()); // Reset các lựa chọn khi tải lại dữ liệu
        try {
          
            const filter ={limit: itemsPerPage, page: currentPage, chainId: filterChain, name:filterName, address: filterAddress };
            const data = await tokenApi.searchTokens(filter); // Lấy tất cả từ backend
            setTokens(data.tokens);
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
        setError(err.message || 'Không thể tải danh sách token.');
        console.error('Error fetching tokens:', err);
        } finally {
        setIsLoading(false);
        }
    }, [currentPage, itemsPerPage, filterChain, filterName, filterAddress]);

  // Gọi fetchTokens khi component mount
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Logic chọn/bỏ chọn một token
  const handleToggleSelectToken = (tokenId) => {
    setSelectedTokenIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(tokenId)) {
        newSelected.delete(tokenId);
      } else {
        newSelected.add(tokenId);
      }
      return newSelected;
    });
  };

    // Logic chọn/bỏ chọn tất cả các token hiển thị
    const handleToggleSelectAll = () => {
        if (selectedTokenIds.size === tokens.length && tokens.length > 0) {
            // Nếu tất cả đang được chọn, bỏ chọn tất cả
            setSelectedTokenIds(new Set());
        } else {
            // Chọn tất cả các token hiển thị
            const allFilteredTokenIds = new Set(tokens.map(token => token.id));
            setSelectedTokenIds(allFilteredTokenIds);
        }
    };

    // Kiểm tra xem tất cả token hiển thị có đang được chọn không
    const isAllSelected = tokens.length > 0 && selectedTokenIds.size === tokens.length;

    const handleAddToken = () => {
        navigate('/token/new');
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

    const handleDeleteToken = async (tokenId, tokenName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa token "${tokenName}" không?`)) {
            setIsLoading(true);
            setError(null);
            try {
            await tokenApi.delete(tokenId);
            alert('Token đã được xóa thành công!');
            fetchTokens(); // Tải lại danh sách sau khi xóa, reset filters
            } catch (err) {
            setError(err.message || 'Không thể xóa token.');
            console.error('Error deleting token:', err);
            } finally {
            setIsLoading(false);
            }
        }
    };

  // Hàm xử lý xóa nhiều token
  const handleDeleteSelectedTokens = async () => {
    if (selectedTokenIds.size === 0) {
      alert('Vui lòng chọn ít nhất một token để xóa.');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedTokenIds.size} token đã chọn không?`)) {
      setIsLoading(true);
      setError(null);
      try {
        const idsToDelete = Array.from(selectedTokenIds); // Chuyển Set thành Array
        await tokenApi.deleteMultipleTokens(idsToDelete);
        alert(`${selectedTokenIds.size} token đã được xóa thành công!`);
        fetchTokens(); // Tải lại danh sách sau khi xóa hàng loạt
      } catch (err) {
        setError(err.message || 'Không thể xóa các token đã chọn.');
        console.error('Error deleting selected tokens:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Đang tải danh sách token...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Quản Lý Token</h1>
      <div className={styles.actionBar}>
        {/* Filter Controls */}
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label htmlFor="chainFilter" className={styles.filterLabel}>Lọc theo Chain:</label>
            <select
              id="chainFilter"
              className={styles.filterSelect}
              value={filterChain}
              onChange={(e) => setFilterChain(e.target.value)}
            >
              {FILTER_CHAINS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="textFilter" className={styles.filterLabel}>Lọc theo Tên:</label>
            <input
              type="text"
              id="textFilter"
              className={styles.filterInput}
              placeholder="Nhập tên"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="textFilter" className={styles.filterLabel}>Lọc theo địa chỉ:</label>
            <input
              type="text"
              id="textFilter"
              className={styles.filterInput}
              placeholder="Nhập địa chỉ"
              value={filterAddress}
              onChange={(e) => setFilterAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Mass Action and Add Button */}
        <div className={styles.actionButtons}>
          {selectedTokenIds.size > 0 && (
            <button
              className={styles.massDeleteButton} // Sẽ thêm style này vào CSS
              onClick={handleDeleteSelectedTokens}
              disabled={isLoading}
            >
              Xóa ({selectedTokenIds.size}) mục đã chọn
            </button>
          )}
          <button className={styles.addButton} onClick={handleAddToken}>
            Thêm Token Mới
          </button>
        </div>
      </div>

      {tokens.length === 0 ? (
        <p className={styles.noDataMessage}>
          {tokens.length === 0 ? 'Chưa có token nào trên hệ thống.' : 'Không tìm thấy token nào phù hợp với bộ lọc.'}
        </p>
      ) : (
        <>
            <div className={styles.tableResponsive}>
            <table className={styles.tokenTable}>
                <thead>
                <tr>
                    <th>
                    <input
                        type="checkbox"
                        className={styles.selectAllCheckbox}
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        disabled={isLoading || tokens.length === 0}
                    />
                    </th>
                    <th>Tên Token</th>
                    <th>Decimals</th>
                    <th>Địa chỉ Contract</th>
                    <th>Chain</th>
                    <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {tokens.map((token) => (
                    <tr key={token.id}>
                    {/* Checkbox cho từng hàng */}
                    <td>
                        <input
                        type="checkbox"
                        className={styles.selectItemCheckbox}
                        checked={selectedTokenIds.has(token.id)}
                        onChange={() => handleToggleSelectToken(token.id)}
                        disabled={isLoading}
                        />
                    </td>
                    
                    <td>{token.token_name}</td>
                    <td>{token.decimals}</td>
                    <td className={styles.addressCell}>
                        <a
                        href={
                            getTokenAddressUrls(token.chain_id, token.address)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.addressLink}
                        >
                        {token.address?.substring(0, 6)}...{token.address?.substring(token.address.length - 4)}
                        </a>
                    </td>
                    <td>{getChainNameById(token.chain_id)}</td>
                    <td className={styles.actionsCell}>
                        <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteToken(token.id, token.token_name)}
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

export default TokenManagerPage;