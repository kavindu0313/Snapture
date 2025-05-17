import React from 'react';
import Layout from '../components/layout/Layout';
import NotificationCenter from '../components/notification/NotificationCenter';
import NotificationList from '../components/notification/NotificationList';

import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <NotificationCenter />
    </Layout>
  );
};

export default Notifications;