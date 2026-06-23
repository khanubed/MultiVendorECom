import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute Component
 * Restricts access to routes based on authentication and role
 * 
 * @param {React.Component} element - The component to render if authorized
 * @param {Array<string>} requiredRoles - Array of allowed roles (e.g., ['customer', 'vendor'])
 * @param {boolean} loading - Whether the auth check is still in progress
 */
export const ProtectedRoute = ({ element, requiredRoles = [], loading = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-200">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          <span className="text-sm font-semibold text-slate-700">Verifying access...</span>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Has specific role requirements
  if (requiredRoles.length > 0) {
    const userRole = user.role || user.userRole;
    
    // User doesn't have required role - redirect to home or unauthorized
    if (!requiredRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  // All checks passed - render the protected component
  return element;
};

export default ProtectedRoute;
