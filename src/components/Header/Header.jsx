// src/components/Layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';1
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import styles from './Header.module.css';
import ConnectWalletButton from '../Common/ConnectWalletButton/ConnectWalletButton.jsx';

const Header = ({ appName, navLinks }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          {appName || 'YourAppLogo'} {/* Sử dụng appName nếu được truyền vào, nếu không thì dùng mặc định */}
        </Link>
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                {navLinks.map((link) => (
                    (link.requiresAuth && isAuthenticated) ? (
                        <li key={link.path} className={styles.navItem}>
                            <Link to={link.path} className={styles.navLink}>{link.label}</Link>
                        </li>
                    ) : null
                ))}
                {isAuthenticated ? (
                    <>
                      <li className={styles.navItem}>
                        <button onClick={logout} className={styles.logoutButton}>Đăng xuất</button>
                      </li>
                      <li className={`${styles.navItem} ${styles.connectWalletNavItem}`}>
                        <ConnectWalletButton />
                      </li>
                    </>
                ) : (
                <li className={styles.navItem}>
                    <Link to="/login" className={`${styles.navLink} ${styles.loginButton}`}>Đăng nhập</Link>
                </li>
                )}
            </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
