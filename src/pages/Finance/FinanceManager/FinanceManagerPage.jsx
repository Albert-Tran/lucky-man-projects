import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import styles from './FinanceManagerPage.module.css'; // Style riêng cho trang

const FinanceManagerPage = () => {
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const handleNavigate = (path) => {
    navigate(path); // Chuyển hướng đến đường dẫn được chỉ định
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Thực hiện giao dịch</h1>
      <p>Chọn loại giao dịch:</p>

      <div className={styles.buttonGrid}>
        <button className={styles.actionButton} onClick={() => handleNavigate('/finance/swap')}>
          Trao đổi
        </button>
        <button className={styles.actionButton} onClick={() => handleNavigate('/finance/transfer')}>
          Chuyển khoản
        </button>
        <button className={styles.actionButton} onClick={() => handleNavigate('/finance/success')}>
          Trao đổi ngẫu nhiên
        </button>
      </div>
    </div>
  );
};

export default FinanceManagerPage;