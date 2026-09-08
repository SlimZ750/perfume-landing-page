import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen grid place-items-center">جار التحقق...</div>;
  return session ? <Outlet /> : <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
