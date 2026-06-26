import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute Component
 * Restricts access to routes based on precise multi-tenant authentication and roles
 */
export const ProtectedRoute = ({
  element,
  requiredRoles = [],
  loading = false,
}) => {
  const { isAuthenticated, user } = useAuth();

  // 1. Handle Loading States
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-200">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          <span className="text-sm font-semibold text-slate-700">
            Verifying access...
          </span>
        </div>
      </div>
    );
  }

  // 2. Fetch and Normalize User Role (Checks auth state first, falls back to localStorage)
  const rawRole =
    user?.role || user?.userRole || localStorage.getItem("role") || "";
  const normalizedRole = rawRole.trim().toLowerCase();

  // 3. Determine Route Context Base Targets
  const isVendorRoute = requiredRoles.includes("vendor");
  const isAdminRoute = requiredRoles.includes("admin");

  // 4. Handle Unauthenticated Users (Not logged in)
  if (!isAuthenticated || !rawRole) {
    if (isVendorRoute) return <Navigate to="/vendor/auth" replace />;
    if (isAdminRoute) return <Navigate to="/admin/login" replace />;
    return <Navigate to="/login" replace />;
  }

  // 5. Handle Authenticated Users with Incorrect Roles (Role Mismatch)
  if (requiredRoles.length > 0) {
    // Treat "customer" and "costumer" variations identically
    const satisfiesRole = requiredRoles.some((role) => {
      const targetRole = role.toLowerCase();
      if (targetRole === "customer") {
        return normalizedRole === "customer" || normalizedRole === "costumer";
      }
      return normalizedRole === targetRole;
    });

    if (!satisfiesRole) {
      // If they failed a vendor-specific route check, drop them to vendor authentication portal
      if (isVendorRoute) return <Navigate to="/vendor/auth" replace />;

      // If they failed an admin-specific route check, drop them to admin login portal
      if (isAdminRoute) return <Navigate to="/admin/login" replace />;

      // Universal cross-tenant dashboard routing defaults
      if (normalizedRole === "vendor") return <Navigate to="/vendor" replace />;
      if (normalizedRole === "admin") return <Navigate to="/admin" replace />;

      // Fallback baseline for customers/unrecognized roles
      return <Navigate to="/" replace />;
    }
  }

  // 6. Access Granted
  return element;
};

export default ProtectedRoute;
