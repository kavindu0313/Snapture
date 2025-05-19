import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Following.css';

function Following({ userId, isCurrentUser }) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      setCurrentUserId(loggedInUserId);
    }
    
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/users/${userId}/following`);
      setFollowing(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching following:', err);
      setError('Failed to load following. Please try again.');
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await axios.delete(`http://localhost:8080/users/${currentUserId}/unfollow/${targetUserId}`);
      
      // Remove the unfollowed user from the list
      setFollowing(following.filter(user => user.id !== targetUserId));
    } catch (err) {
      console.error('Error unfollowing user:', err);
      alert('Failed to unfollow user. Please try again.');
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="following-loading">
        <div className="loading-spinner"></div>
        <p>Loading following...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="following-error">
        <p>{error}</p>
        <button onClick={fetchFollowing} className="retry-btn">Retry</button>
      </div>
    );
  }

  if (following.length === 0) {
    return (
      <div className="no-following">
        <p>{isCurrentUser ? 'You are not following anyone yet.' : 'This user is not following anyone yet.'}</p>
      </div>
    );
  }

  return (
    <div className="following-container">
      <h2 className="following-title">Following</h2>
      <div className="following-list">
        {following.map(followedUser => (
          <div key={followedUser.id} className="following-item">
            <div className="following-info" onClick={() => navigateToProfile(followedUser.id)}>
              <div className="following-avatar">
                {followedUser.profileImageUrl ? (
                  <img 
                    src={`http://localhost:8080/uploads/profiles/${followedUser.profileImageUrl}`} 
                    alt={followedUser.fullname}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {followedUser.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="following-details">
                <h3 className="following-name">{followedUser.fullname}</h3>
              </div>
            </div>
            
            {isCurrentUser && (
              <div className="following-actions">
                <button 
                  className="unfollow-btn"
                  onClick={() => handleUnfollow(followedUser.id)}
                >
                  Unfollow
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Following;
