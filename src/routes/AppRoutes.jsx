import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import ProfilePage from '../pages/Profile/ProfilePage.jsx';
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
              <Route path="profile" element={<ProfilePage />} />
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
