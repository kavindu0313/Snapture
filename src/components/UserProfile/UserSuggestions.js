import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';
import './UserSuggestions.css';

function UserSuggestions({ limit = 5 }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchSuggestions();
  }, []);
  
  const fetchSuggestions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      setLoading(true);
      // Get users that the current user is not following
      const response = await axios.get(`http://localhost:8080/users/suggestions?userId=${userId}&limit=${limit}`);
      setSuggestions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user suggestions:', err);
      setError('Failed to load suggestions');
      setLoading(false);
    }
  };
  
  const handleFollowStatusChange = (userId, isFollowing) => {
    if (!isFollowing) {
      // If unfollowed, we can add the user back to suggestions
      fetchSuggestions();
    } else {
      // If followed, remove from suggestions
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(user => user.id !== userId)
      );
    }
  };
  
  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  if (loading) {
    return (
      <div className="suggestions-loading">
        <div className="suggestions-spinner"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="suggestions-error">
        <p>{error}</p>
        <button onClick={fetchSuggestions} className="retry-btn">Retry</button>
      </div>
    );
  }
  
  if (suggestions.length === 0) {
    return (
      <div className="suggestions-empty">
        <p>No suggestions available</p>
      </div>
    );
  }
  
  return (
    <div className="user-suggestions">
      <h3 className="suggestions-title">Suggested for you</h3>
      <div className="suggestions-list">
        {suggestions.map(user => (
          <div key={user.id} className="suggestion-item">
            <div className="suggestion-user-info" onClick={() => navigateToProfile(user.id)}>
              <div className="suggestion-avatar">
                {user.profileImageUrl ? (
                  <img 
                    src={`http://localhost:8080/uploads/profiles/${user.profileImageUrl}`} 
                    alt={user.fullname}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="suggestion-avatar-placeholder">
                    {user.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="suggestion-details">
                <h4 className="suggestion-name">{user.fullname}</h4>
              </div>
            </div>
            <FollowButton 
              targetUserId={user.id} 
              onFollowStatusChange={(isFollowing) => handleFollowStatusChange(user.id, isFollowing)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSuggestions;
