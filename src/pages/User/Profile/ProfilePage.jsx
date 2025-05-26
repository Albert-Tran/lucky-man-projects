import React from 'react';
import { useAuth } from '../../../contexts/auth/AuthContext.jsx';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.profileContainer}>
      <h1>Trang Hồ sơ cá nhân</h1>
      {user ? (
        <>
          <p>Chào mừng, <strong className={styles.username}>{user.username}</strong>!</p>
          <p>ID của bạn: <span className={styles.userId}>{user.id}</span></p>
          <button onClick={logout} className={styles.logoutButton}>
            Đăng xuất
          </button>
        </>
      ) : (
        <p>Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
};

export default ProfilePage;
