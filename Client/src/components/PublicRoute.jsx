import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * PublicRoute Component
 * Allows access to public pages (like login/register)
 * but redirects authenticated users to home
 * 
 * @param {React.Component} element - The component to render if not authenticated
 */
export const PublicRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();

  // If already authenticated, redirect based on role
  if (isAuthenticated && user) {
    const userRole = user.role || user.userRole;
    
    if (userRole === 'vendor') {
      return <Navigate to="/vendor" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Not authenticated - allow access to public page
  return element;
};

export default PublicRoute;
