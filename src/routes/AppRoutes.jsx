import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import ProfilePage from '../pages/User/Profile/ProfilePage.jsx';
import ChangePasswordPage from '../pages/User/ChangePassword/ChangePasswordPage.jsx';

import WalletManagerPage from '../pages/Wallet/WalletManager/WalletManagerPage.jsx';
import CreateWalletPage from '../pages/Wallet/CreateWallet/CreateWalletPage.jsx';
import WalletGroupManagerPage from '../pages/Wallet/WalletGroupManager/WalletGroupManagerPage.jsx';
import CreateWalletGroupPage from '../pages/Wallet/CreateWalletGroup/CreateWalletGroupPage.jsx';
import EditWalletGroupPage from '../pages/Wallet/EditWalletGroup/EditWalletGroupPage.jsx';
import DetailWalletGroupPage from '../pages/Wallet/DetailWalletGroup/DetailWalletGroupPage.jsx';

import CreateTokenPage from '../pages/Token/CreateToken/CreateTokenPage.jsx';
import TokenManagerPage from '../pages/Token/TokenManager/TokenManagerPage.jsx';

import FinanceManagerPage from '../pages/Finance/FinanceManager/FinanceManagerPage.jsx';
import TransferPage from '../pages/Finance/Transfer/TransferPage.jsx';
import SelectTokenTransferPage from '../pages/Finance/Transfer/SelectTokenTransferPage.jsx';
import SelectModeAndWalletTransferPage from '../pages/Finance/Transfer/SelectModeAndWalletTransferPage.jsx';

import SwapPage from '../pages/Finance/Swap/SwapPage.jsx';
import SelectModeAndTokenSwapPage from '../pages/Finance/Swap/SelectModeAndTokenSwapPage.jsx';
import SelectWalletAndAmountSwapPage from '../pages/Finance/Swap/SelectWalletAndAmountSwapPage.jsx';

import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout.jsx';
import { AuthProvider } from '../contexts/auth/AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import SuccessPage from '../pages/Finance/Success/SuccessPage.jsx';

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
              {/* Token router */}
              <Route path="token" element={<TokenManagerPage />} />
              <Route path="token/new" element={<CreateTokenPage />} />
              {/* Token router */}
              {/* Wallet router */}
              <Route path="wallet" element={<WalletManagerPage />} />
              <Route path="wallet/new" element={<CreateWalletPage />} />
              <Route path="wallet/wallet-group" element={<WalletGroupManagerPage />} />
              <Route path="wallet/wallet-group/new" element={<CreateWalletGroupPage />} />
              <Route path="wallet/wallet-group/:id" element={<DetailWalletGroupPage />} />
              <Route path="wallet/wallet-group/:id/edit" element={<EditWalletGroupPage />} />
              {/* Wallet router */}
              {/** Blockchain router */}
              <Route path="finance" element={<FinanceManagerPage />} />
              <Route path="finance/transfer" element={<TransferPage />} />
              <Route path="/finance/transfer/chain/:chainId" element={<SelectTokenTransferPage />} />
              <Route path="/finance/transfer/chain/:chainId/token/:tokenAddress" element={<SelectModeAndWalletTransferPage />} />
              <Route path="finance/swap" element={<SwapPage />} />
              <Route path="/finance/swap/chain/:chainId" element={<SelectModeAndTokenSwapPage />} />
              <Route path="/finance/swap/chain/:chainId/mode/:mode/token/:tokenAddress" element={<SelectWalletAndAmountSwapPage />} />
              <Route path="/finance/success" element={<SuccessPage />} />
              {/** Blockchain router */}
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
