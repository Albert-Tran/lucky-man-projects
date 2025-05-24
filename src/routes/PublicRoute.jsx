import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import { ROUTES } from './routeConstants';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default PublicRoute;
