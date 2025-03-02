import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // If authentication is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated or not an admin, redirect to home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render the child routes
  return <Outlet />;
};

export default AdminRoute; 