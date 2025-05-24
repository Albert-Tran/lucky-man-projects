import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <h1>Chào mừng đến với trang chủ!</h1>
      <p className={styles.description}>Đây là dự án React cơ sở của bạn với Vite, React Router DOM và cấu trúc module hóa.</p>
      <Link to="/about" className={styles.linkButton}>Tìm hiểu thêm</Link>
    </div>
  );
};

export default HomePage;
