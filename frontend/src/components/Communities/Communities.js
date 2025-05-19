import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Communities.css';

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    fetchCommunities();
    fetchUserCommunities(userId);
  }, [navigate]);
  
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/communities');
      setCommunities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError('Failed to load communities. Please try again.');
      setLoading(false);
    }
  };
  
  const fetchUserCommunities = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}/communities`);
      setUserCommunities(response.data);
    } catch (err) {
      console.error('Error fetching user communities:', err);
    }
  };
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCommunities();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/communities/search?keyword=${searchTerm}`);
      setCommunities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching communities:', err);
      setError('Failed to search communities. Please try again.');
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const navigateToCommunity = (communityId) => {
    navigate(`/communities/${communityId}`);
  };
  
  const displayedCommunities = activeTab === 'all' ? communities : userCommunities;
  
  return (
    <div className="communities-container">
      <header className="communities-header">
        <h1>Communities</h1>
        <p className="communities-subtitle">Join communities to connect with like-minded photographers</p>
      </header>
      
      <div className="communities-search-bar">
        <input 
          type="text" 
          placeholder="Search communities..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      <div className="communities-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Communities
        </button>
        <button 
          className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          My Communities
        </button>
        <Link to="/communities/create" className="create-community-btn">
          Create
        </Link>
      </div>
      
      {loading ? (
        <div className="communities-loading">
          <div className="spinner"></div>
          <p>Loading communities...</p>
        </div>
      ) : error ? (
        <div className="communities-error">
          <p>{error}</p>
          <button onClick={fetchCommunities} className="retry-btn">Retry</button>
        </div>
      ) : displayedCommunities.length === 0 ? (
        <div className="communities-empty">
          <p>
            {activeTab === 'all' 
              ? 'No communities found. Try a different search term or create a new community!' 
              : 'You haven\'t joined any communities yet. Join a community to see it here!'}
          </p>
          {activeTab === 'all' ? (
            <Link to="/communities/create" className="create-community-btn-large">
              Create Community
            </Link>
          ) : (
            <button 
              className="view-all-btn-large"
              onClick={() => setActiveTab('all')}
            >
              View All Communities
            </button>
          )}
        </div>
      ) : (
        <div className="communities-grid">
          {displayedCommunities.map(community => (
            <div 
              key={community.communityId} 
              className="community-card"
              onClick={() => navigateToCommunity(community.communityId)}
            >
              <div className="community-cover">
                <div className="community-cover-placeholder">
                  <span>{community.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="community-info">
                <h3 className="community-name">{community.name}</h3>
                <p className="community-description">{community.description}</p>
                <div className="community-stats">
                  <span className="community-members">
                    <i className="fas fa-users"></i> {community.memberCount} members
                  </span>
                  <span className="community-posts">
                    <i className="fas fa-image"></i> {community.postCount} posts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Communities;