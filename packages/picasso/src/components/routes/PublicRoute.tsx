/**
 * PublicRoute.js
 * Route component for public routes (redirect if already logged in)
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  if (user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default PublicRoute;