import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostEditor from '../components/post/PostEditor';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const CreatePostPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (data: { image: string; caption: string; tags: string[] }) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to create a post
      console.log('Creating post with data:', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to home page after successful post creation
      navigate('/home');
    } catch (error) {
      console.error('Error creating post:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className={`mb-6 text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>Create New Post</h1>
        
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className={`text-lg ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Creating your post...</p>
          </div>
        ) : (
          <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
            <PostEditor onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreatePostPage;
