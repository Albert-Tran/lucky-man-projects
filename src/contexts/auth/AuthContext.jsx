import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage.js';
import authApi from '../../services/api/authApi.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const isAuthenticated = !!user;

  const navigate = useNavigate();

  const login = useCallback(async (username, password) => {
    try {
      const data = await authApi.login(username, password);
      const loggedInUser = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        token: data.token,
      };
      setUser(loggedInUser);
      console.log('Login successful:', loggedInUser);
      return true;
    } catch (error) {
      console.error('Login failed in AuthContext:', error.message);
      throw error; 
    }
  }, [setUser]);

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
  }), [user, isAuthenticated, login, logout]);


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
