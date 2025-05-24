import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404 - Không Tìm Thấy Trang</h1>
      <p className={styles.message}>Xin lỗi, trang bạn đang tìm không tồn tại.</p>
      <Link to="/" className={styles.backHomeButton}>Quay về Trang Chủ</Link>
    </div>
  );
};

export default NotFoundPage;
