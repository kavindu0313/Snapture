import React from 'react';
import Layout from '../components/layout/Layout';
import CreateCommunity from '../components/community/CreateCommunity';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const CreateCommunityPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
//return data to create community page
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create New Community</h1>
        <CreateCommunity />
      </div>
    </Layout>
  );
};

export default CreateCommunityPage;
