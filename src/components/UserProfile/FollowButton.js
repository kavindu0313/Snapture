import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FollowButton.css';

function FollowButton({ targetUserId, initialIsFollowing = false, onFollowStatusChange }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      setCurrentUserId(loggedInUserId);
      
      // If initialIsFollowing wasn't provided, check follow status
      if (initialIsFollowing === false) {
        checkFollowStatus(loggedInUserId, targetUserId);
      } else {
        setIsFollowing(initialIsFollowing);
      }
    }
  }, [targetUserId, initialIsFollowing]);

  const checkFollowStatus = async (userId, targetId) => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/isFollowing/${targetId}`);
      setIsFollowing(response.data.isFollowing);
    } catch (err) {
      console.error('Error checking follow status:', err);
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId) {
      alert('Please log in to follow users');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`http://localhost:8080/users/${currentUserId}/follow/${targetUserId}`);
      setIsFollowing(true);
      
      if (onFollowStatusChange) {
        onFollowStatusChange(true);
      }
    } catch (err) {
      console.error('Error following user:', err);
      alert('Failed to follow user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUserId) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/users/${currentUserId}/unfollow/${targetUserId}`);
      setIsFollowing(false);
      
      if (onFollowStatusChange) {
        onFollowStatusChange(false);
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      alert('Failed to unfollow user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUserId === targetUserId.toString()) {
    return null; // Don't show follow button for own profile
  }

  return (
    <button
      className={`follow-button ${isFollowing ? 'following' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      ) : isFollowing ? (
        'Unfollow'
      ) : (
        'Follow'
      )}
    </button>
  );
}

export default FollowButton;
