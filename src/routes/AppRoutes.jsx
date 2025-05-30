import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import ProfilePage from '../pages/User/Profile/ProfilePage.jsx';
import ChangePasswordPage from '../pages/User/ChangePassword/ChangePasswordPage.jsx';
import WalletGroupManagerPage from '../pages/Wallet/WalletGroupManager/WalletGroupManagerPage.jsx';
import CreateWalletGroupPage from '../pages/Wallet/CreateWalletGroupPage/CreateWalletGroupPage.jsx';
import EditWalletGroupPage from '../pages/Wallet/EditWalletGroupPage/EditWalletGroupPage.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout.jsx';
import { AuthProvider } from '../contexts/auth/AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Bọc toàn bộ Routes bằng AuthProvider */}
        <Routes>
          {/* Route với layout mặc định */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
            {/* Các route được bảo vệ bởi PrivateRoute */}
            <Route element={<PrivateRoute />}>
              {/* User router */}
              <Route path="user/profile" element={<ProfilePage />} />
              <Route path="user/change-password" element={<ChangePasswordPage />} />
              {/* User router */}
              {/* Wallet router */}
              <Route path="wallet/wallet-groups" element={<WalletGroupManagerPage />} />
              <Route path="wallet/wallet-groups/new" element={<CreateWalletGroupPage />} />
              <Route path="wallet/wallet-groups/:id/edit" element={<EditWalletGroupPage />} />
              {/* 
              <Route path="wallet/wallet-groups/:groupId" element={<WalletGroupDetailsPage />} />
              <Route path="wallet/wallet-groups/:groupId/edit" element={<EditWalletGroupPage />} /> */}
              {/* Wallet router */}
            </Route>
          </Route>

          {/* Route đăng nhập (không có layout) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Trang 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
