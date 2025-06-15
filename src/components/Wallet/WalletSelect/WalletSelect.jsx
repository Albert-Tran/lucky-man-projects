// src/components/WalletSelect.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './WalletSelect.module.css'; // Sử dụng lại CSS Modules
import walletApi from '../../../services/api/walletApi.js'; // API của bạn
import CONFIG from '../../../utils/config/config.js';

// Icon mũi tên xuống
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L12 15L17 10" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ITEMS_PER_PAGE = CONFIG[import.meta.env.VITE_MODE].ITEMS_PER_PAGE_IN_SELECT_FIELD;

const WalletSelect = ({
  value,   // Giá trị ví hiện tại được chọn (e.g., wallet address)
  onChange, // Callback khi giá trị thay đổi (e.g., (newWalletAddress) => {})
  placeholder = 'Select a wallet',
  label = '',
  isDisabled = false,
  formErrors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectRef = useRef(null);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const currentPageRef = useRef(1);

  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);

  // Hàm fetch API chính cho ví
  const fetchOptions = useCallback(async (pageToFetch, isInitialFetch) => {
    console.log(`[WalletSelect] Attempting to fetch wallets page ${pageToFetch}. Initial: ${isInitialFetch}`);

    if (isFetchingRef.current || (!hasMoreRef.current && !isInitialFetch)) {
      console.log("[WalletSelect] Aborting fetch: Already fetching or no more data.");
      return;
    }

    setIsLoading(true);
    isFetchingRef.current = true;
    setError(null);

    try {
      const response = await walletApi.getWallets({page: pageToFetch, limit: ITEMS_PER_PAGE});

      const newItems = response.wallets || [];
      const totalItems = response.total || 0;

      console.log(`[WalletSelect] API Response: Total ${totalItems} wallets, fetched ${newItems.length} on page ${pageToFetch}.`);

      const formattedItems = newItems.map(item => ({
        value: item.id,
        label: `${item.address.substring(0, 6)}...${item.address.substring(item.address.length - 4)}`,
        original: item,
      }));

      setOptions(prevOptions => {
        if (isInitialFetch) {
            return formattedItems;
        } else {
            return [...prevOptions, ...formattedItems];
        }
      });

      const newHasMore = (pageToFetch * ITEMS_PER_PAGE) < totalItems;
      setHasMore(newHasMore);
      hasMoreRef.current = newHasMore;

    } catch (err) {
      console.error('Error fetching wallets:', err);
      setError(err.response?.data?.message || 'Failed to load wallets.');
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // KHÔNG CÓ DEPENDENCY Ở ĐÂY vì API getWallets không cần tham số thay đổi


  // Effect để fetch ví ban đầu
  useEffect(() => {
    console.log("[WalletSelect] Initial fetch for wallets.");
    setCurrentPage(1);
    currentPageRef.current = 1;
    setHasMore(true);
    hasMoreRef.current = true;
    setOptions([]);
    isFetchingRef.current = false;

    fetchOptions(1, true);
  }, [fetchOptions]);


  // Xử lý khi nhấn nút "Load More"
  const handleLoadMore = useCallback(() => {
    console.log(`[WalletSelect - handleLoadMore] Triggered. hasMore: ${hasMore}, isLoading: ${isLoading}, isFetchingRef.current: ${isFetchingRef.current}`);
    if (hasMore && !isLoading && !isFetchingRef.current) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      currentPageRef.current = nextPage;
      fetchOptions(nextPage, false);
    }
  }, [hasMore, isLoading, currentPage, fetchOptions]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Xử lý chọn một option
  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  // Hiển thị giá trị đã chọn
  const selectedOptionLabel = options.find(option => option.value === value)?.label || placeholder;

  return (
    <div className={styles.customSelectContainer} ref={selectRef}>
      {label && <label className={styles.label}>{label}:</label>}

      <div
        className={`${styles.selectedDisplay} ${isOpen ? styles.open : ''} ${isDisabled ? styles.disabled : ''} ${formErrors ? styles.error : ''}`}
        onClick={() => !isDisabled && setIsOpen(prev => !prev)}
      >
        <div className={styles.selectedLabel}>{selectedOptionLabel}</div>
        <div className={styles.arrowIcon}>
          <ChevronDownIcon />
        </div>
      </div>

      {formErrors && <p className={styles.errorMessage}>{formErrors}</p>}

      {isOpen && !isDisabled && (
        <div className={styles.optionsDropdown}>
          <div className={styles.optionsList}>
            {isLoading && options.length === 0 ? (
              <div className={styles.message}>Loading wallets...</div>
            ) : error ? (
              <div className={styles.errorMessage}>{error}</div>
            ) : options.length === 0 ? (
              <div className={styles.message}>No wallets available.</div>
            ) : (
              options.map((option, index) => (
                <div
                  key={option.value || index}
                  className={`${styles.optionItem} ${option.value === value ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))
            )}

            {hasMore && (
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More Wallets'}
              </button>
            )}

            {!isLoading && !hasMore && options.length > 0 && (
              <div className={styles.message}>All wallets loaded.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSelect;