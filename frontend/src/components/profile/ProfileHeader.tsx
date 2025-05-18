import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';

interface ProfileHeaderProps {
  profile: User;
  onProfileUpdate: (updatedProfile: User) => void;
}
//profile header
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onProfileUpdate }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    user ? profile.followers.includes(user.id) : false
  );
  //followers count
  const [followersCount, setFollowersCount] = useState(profile.followers.length);
  //editing
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: profile.fullName,
    bio: profile.bio || '',
    profilePicture: profile.profilePicture || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isOwnProfile = user && user.id === profile.id;

  const handleFollow = async () => {
    if (!user) return;
    //follow/unfollow
    try {
      setIsLoading(true);
      if (isFollowing) {
        await userAPI.unfollowUser(user.id, profile.id);
        setFollowersCount(prev => prev - 1);
      } else {
        await userAPI.followUser(user.id, profile.id);
        setFollowersCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    } finally {
      setIsLoading(false);
    }
  };
  //edit profile
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  //save profile
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const updatedProfile = await userAPI.updateProfile(user.id, editData);
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  //profile header
  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.username}&size=150&background=random`}
            alt={profile.username}
            className="object-cover w-32 h-32 rounded-full"
          />
        </div>
        
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col items-center justify-between mb-4 md:flex-row">
            <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
            
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 mt-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md md:mt-0 hover:bg-gray-200"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={isLoading}
                className={`px-4 py-2 mt-2 text-sm font-medium rounded-md md:mt-0 ${
                  isFollowing
                    ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleEditChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={editData.bio}
                  onChange={handleEditChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePicture"
                  name="profilePicture"
                  value={editData.profilePicture}
                  onChange={handleEditChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4 space-x-8 md:justify-start">
                <div className="text-center">
                  <span className="block text-lg font-bold">{profile.following.length}</span>
                  <span className="text-sm text-gray-500">Following</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold">{followersCount}</span>
                  <span className="text-sm text-gray-500">Followers</span>
                </div>
              </div>
              
              <div>
                <h2 className="font-bold text-gray-900">{profile.fullName}</h2>
                {profile.bio && <p className="mt-1 text-gray-700">{profile.bio}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
