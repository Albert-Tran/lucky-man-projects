// src/components/TransactionSuccessPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Giả sử bạn đang dùng React Router

import styles from './SuccessPage.module.css'; // Tạo file CSS Modules tương ứng

const SuccessPage = () => {
  const navigate = useNavigate(); // Hook từ React Router để điều hướng

  const handleGoBack = () => {
    navigate('/finance');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Giao dịch thành công!</h1>
      <p className={styles.message}>Giao dịch của bạn đã được xử lý thành công. Ấn tiếp tục để thực hiện các giao dịch khác</p>
      
      {/* Icon hoặc hình ảnh minh họa thành công */}
      <div className={styles.successIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-8.98"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <button className={styles.backButton} onClick={handleGoBack}>
        Tiếp tục
      </button>
    </div>
  );
};

export default SuccessPage;