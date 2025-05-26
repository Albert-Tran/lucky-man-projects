import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import styles from './DefaultLayout.module.css';

const DefaultLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <h1>Tên ứng dụng</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Trang Chủ</Link>
          <Link to="/about" className={styles.navLink}>Giới thiệu</Link>
          <Link to="/user/profile" className={styles.navLink}>Hồ sơ</Link>
        </nav>
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <>
              <span className={styles.welcomeText}>Xin chào, {user?.username}!</span>
              <button onClick={logout} className={styles.logoutButton}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Dự án Base. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DefaultLayout;
