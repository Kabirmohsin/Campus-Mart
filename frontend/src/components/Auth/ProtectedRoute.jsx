import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Layout/LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false, requireSeller = false, requireBuyer = false }) => {
  const { user, loading, isAdmin, isSeller, isBuyer } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin check
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Seller check
  if (requireSeller && !isSeller()) {
    return <Navigate to="/" replace />;
  }

  // Buyer check
  if (requireBuyer && !isBuyer()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;