import React, { useState, useEffect } from 'react';
import { Post } from '../../types';
import { posts as postAPI } from '../../services/apiConfig';
import PostCard from '../post/PostCard';

interface ProfilePostsProps {
  userId: string;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const userPosts = await postAPI.getUserPosts(userId);
        setPosts(userPosts);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ProfilePosts;
