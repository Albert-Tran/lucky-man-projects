// src/components/Common/Pagination.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Pagination.module.css';
import CONFIG from '../../../utils/config/config.js';

const ITEMS_PER_PAGE_OPTIONS = CONFIG[import.meta.env.VITE_MODE].ITEMS_PER_PAGE_OPTIONS;

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  if (totalPages <= 1 && totalItems === 0) {
    return null; // Không hiển thị phân trang nếu chỉ có 1 trang hoặc không có dữ liệu
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Hiển thị tối đa 5 nút trang (hoặc ít hơn nếu tổng số trang ít)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Điều chỉnh để luôn hiển thị 5 nút nếu có thể
    if (endPage - startPage + 1 < 5) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, 5);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ''}`}
        >
          {i}
        </button>
      );
    }

    // Thêm dấu ... nếu cần
    if (startPage > 1) {
      pageNumbers.unshift(<span key="ellipsis-start" className={styles.ellipsis}>...</span>);
    }
    if (endPage < totalPages) {
      pageNumbers.push(<span key="ellipsis-end" className={styles.ellipsis}>...</span>);
    }

    return pageNumbers;
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        Trước
      </button>

      {renderPageNumbers()} {/* Render các nút số trang */}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Sau
      </button>

      <div className={styles.itemsPerPage}>
        <label htmlFor="items-per-page">Mục/trang:</label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className={styles.selectPerPage}
        >
          {ITEMS_PER_PAGE_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <span className={styles.pageInfo}>
        Trang {currentPage} trên {totalPages} (Tổng: {totalItems} nhóm)
      </span>
    </div>
  );
};

export default Pagination;
