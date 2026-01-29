// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useAuth();

  // Non-blocking: We default to Guest Mode, so we don't wait for loading.
  // The 'loading' state in AuthContext is now non-blocking (always false effectively).

  // Allow access if user is logged in OR in guest mode
  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;



