import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    // Redirect to admin login if not authenticated as admin
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminRoute;
