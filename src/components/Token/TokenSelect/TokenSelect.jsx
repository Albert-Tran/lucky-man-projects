// src/components/CustomLoadMoreSelect.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './TokenSelect.module.css'; // Import CSS Modules
import tokenApi from '../../../services/api/tokenApi.js'; // API của bạn
import CONFIG from '../../../utils/config/config.js';
// Icon mũi tên xuống (tùy chọn, bạn có thể thay bằng SVG của riêng mình)
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L12 15L17 10" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ITEMS_PER_PAGE = CONFIG[import.meta.env.VITE_MODE].ITEMS_PER_PAGE_IN_SELECT_FIELD;

const TokenSelect = ({
  chainId,
  value,
  onChange,
  placeholder = 'Select an option',
  isDisabled = false,
  formErrors
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

  const fetchOptions = useCallback(async (pageToFetch, isInitialFetch) => {
    console.log(`[fetchOptions] Attempting to fetch page ${pageToFetch} for chain ${chainId}. Initial: ${isInitialFetch}`);
    
    if (isFetchingRef.current || (!hasMoreRef.current && !isInitialFetch)) {
      console.log("[fetchOptions] Aborting fetch: Already fetching or no more data.");
      return;
    }

    setIsLoading(true);
    isFetchingRef.current = true;
    setError(null);

    try {
      const response = await tokenApi.getTokensByChainId(
        chainId,
        { page: pageToFetch, limit: ITEMS_PER_PAGE }
      );
      
      const newItems = response.tokens || [];
      const totalItems = response.total || 0;

      console.log(`[fetchOptions] API Response: Total ${totalItems} tokens, fetched ${newItems.length} on page ${pageToFetch}.`);

      const formattedItems = newItems.map(item => ({
        value: item.address,
        label: item.token_name,
        original: item
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
      console.error('Error fetching options:', err);
      setError(err.response?.data?.message || 'Failed to load options.');
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [chainId, placeholder]);

  useEffect(() => {
    console.log("[useEffect] ChainId changed. Resetting and refetching.");
    setCurrentPage(1);
    currentPageRef.current = 1;
    setHasMore(true);
    hasMoreRef.current = true;
    setOptions([]);
    isFetchingRef.current = false;

    if (chainId) {
        fetchOptions(1, true);
    } else {
        setOptions([]);
        setHasMore(false);
    }
  }, [chainId, fetchOptions]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && !isFetchingRef.current) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      currentPageRef.current = nextPage;
      fetchOptions(nextPage, false);
    }
  }, [hasMore, isLoading, currentPage, fetchOptions]);

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

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  const selectedOptionLabel = options.find(option => option.value === value)?.label || placeholder;

  return (
    <div className={styles.customSelectContainer} ref={selectRef}>
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
          <div className={styles.optionsList}> {/* Không có onScroll ở đây */}
            {isLoading && options.length === 0 ? (
              <div className={styles.message}>Loading options...</div>
            ) : error ? (
              <div className={styles.errorMessage}>{error}</div>
            ) : options.length === 0 ? (
              <div className={styles.message}>Không có token nào khả dụng.</div>
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
            
            {/* Nút "Load More" */}
            {hasMore && (
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? 'Đang tải...' : 'Tải thêm'}
              </button>
            )}
            
            {!isLoading && !hasMore && options.length > 0 && (
              <div className={styles.message}>Đã tải hết các token.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelect;