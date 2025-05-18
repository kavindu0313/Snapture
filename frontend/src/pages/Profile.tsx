import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { users as userAPI } from '../services/apiConfig';
import Layout from '../components/layout/Layout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfilePosts from '../components/profile/ProfilePosts';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        setIsLoading(true);
        const userData = await userAPI.getProfileByUsername(username);
        setProfile(userData);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    //fetch profile
    fetchProfile();
  }, [username]);

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
    
    // Update current user in auth context if this is the current user's profile
    if (currentUser && currentUser.id === updatedProfile.id) {
      // This would typically update the user in the auth context
      // updateUser(updatedProfile);
    }
  };
  //loading
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            {error || 'User not found'}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader profile={profile} onProfileUpdate={handleProfileUpdate} />
        
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Posts</h2>
          <ProfilePosts userId={profile.id} />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
