import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext.jsx';
import styles from './DefaultLayout.module.css';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';

const DefaultLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navLinks = [
    {
      label: "About Us",
      requiresAuth: false,
      path: "/about"
    },
    {
      label: "Tài Chính",
      requiresAuth: true,
      path: "/finance"
    },
    {
      label: "Ví",
      requiresAuth: true,
      path: "/wallet"
    },
    {
      label: "Token",
      requiresAuth: true,
      path: "/token"
    },
    {
      label: "Nhóm ví",
      requiresAuth: true,
      path: "/wallet/wallet-group"
    },
    {
      label: "Đổi mật khẩu",
      requiresAuth: true,
      path: "/user/change-password"
    },
  ];
  return (
    <div className={styles.layoutContainer}>
      <Header navLinks={navLinks} appName="Lucky Man" />
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default DefaultLayout;
