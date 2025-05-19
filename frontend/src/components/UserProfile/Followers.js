import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Followers.css';

function Followers({ userId, isCurrentUser }) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      setCurrentUserId(loggedInUserId);
    }
    
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/users/${userId}/followers`);
      setFollowers(response.data);
      
      // Get follow status for each follower
      if (response.data.length > 0) {
        const statuses = {};
        for (const follower of response.data) {
          try {
            const statusResponse = await axios.get(
              `http://localhost:8080/users/${currentUserId}/isFollowing/${follower.id}`
            );
            statuses[follower.id] = statusResponse.data.isFollowing;
          } catch (err) {
            console.error(`Error checking follow status for user ${follower.id}:`, err);
            statuses[follower.id] = false;
          }
        }
        setFollowStatus(statuses);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching followers:', err);
      setError('Failed to load followers. Please try again.');
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      await axios.post(`http://localhost:8080/users/${currentUserId}/follow/${targetUserId}`);
      
      // Update follow status
      setFollowStatus({
        ...followStatus,
        [targetUserId]: true
      });
    } catch (err) {
      console.error('Error following user:', err);
      alert('Failed to follow user. Please try again.');
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await axios.delete(`http://localhost:8080/users/${currentUserId}/unfollow/${targetUserId}`);
      
      // Update follow status
      setFollowStatus({
        ...followStatus,
        [targetUserId]: false
      });
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
      <div className="followers-loading">
        <div className="loading-spinner"></div>
        <p>Loading followers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="followers-error">
        <p>{error}</p>
        <button onClick={fetchFollowers} className="retry-btn">Retry</button>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="no-followers">
        <p>{isCurrentUser ? 'You don\'t have any followers yet.' : 'This user doesn\'t have any followers yet.'}</p>
      </div>
    );
  }

  return (
    <div className="followers-container">
      <h2 className="followers-title">Followers</h2>
      <div className="followers-list">
        {followers.map(follower => (
          <div key={follower.id} className="follower-item">
            <div className="follower-info" onClick={() => navigateToProfile(follower.id)}>
              <div className="follower-avatar">
                {follower.profileImageUrl ? (
                  <img 
                    src={`http://localhost:8080/uploads/profiles/${follower.profileImageUrl}`} 
                    alt={follower.fullname}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {follower.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="follower-details">
                <h3 className="follower-name">{follower.fullname}</h3>
              </div>
            </div>
            
            {currentUserId !== follower.id.toString() && (
              <div className="follower-actions">
                {followStatus[follower.id] ? (
                  <button 
                    className="unfollow-btn"
                    onClick={() => handleUnfollow(follower.id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button 
                    className="follow-btn"
                    onClick={() => handleFollow(follower.id)}
                  >
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Followers;
