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
      label: "Hồ sơ",
      requiresAuth: true,
      path: "/user/profile"
    },
    {
      label: "Đổi MK",
      requiresAuth: true,
      path: "/user/change-password"
    },
    {
      label: "Nhóm ví",
      requiresAuth: true,
      path: "/wallet/wallet-groups"
    }
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
