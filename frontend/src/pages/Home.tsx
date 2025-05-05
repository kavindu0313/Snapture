import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { posts as postAPI } from '../services/apiConfig';
import Layout from '../components/layout/Layout';
import PostCard from '../components/post/PostCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated) {
          // Fetch personalized feed for authenticated users
          const response = await postAPI.getFeed(page, 10);
          setPosts(prev => (page === 0 ? response.content : [...prev, ...response.content]));
          setTotalPages(response.totalPages);
        } else {
          // Fetch all posts for non-authenticated users
          const allPosts = await postAPI.getAllPosts();
          setPosts(allPosts);
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, page]);

  const loadMorePosts = () => {
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {!isAuthenticated && (
          <div className="p-6 mb-6 text-center bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to PhotoShare</h1>
            <p className="mt-2 text-gray-600">
              Join our community to share your photos and connect with photographers around the world.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {isAuthenticated && posts.length === 0 && !isLoading && !error && (
          <div className="p-6 mb-6 text-center bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-medium text-gray-900">Your feed is empty</h2>
            <p className="mt-2 text-gray-600">
              Follow users or join communities to see posts in your feed.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <Link
                to="/explore"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Explore
              </Link>
              <Link
                to="/communities"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Communities
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-20">
            <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        {isAuthenticated && page < totalPages - 1 && posts.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMorePosts}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
