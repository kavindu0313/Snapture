import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CommunityPost from './CommunityPost';
import './CommunityDetail.css';

function CommunityDetail() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      navigate('/');
      return;
    }
    
    setUserId(loggedInUserId);
    fetchCommunityDetails(communityId, loggedInUserId);
    fetchCommunityPosts(communityId);
  }, [communityId, navigate]);
  
  const fetchCommunityDetails = async (id, currentUserId) => {
    try {
      setLoading(true);
      
      // Get community details
      const communityResponse = await axios.get(`http://localhost:8080/communities/${id}`);
      const communityData = communityResponse.data;
      setCommunity(communityData);
      
      // Check if user is a member
      setIsMember(communityData.members.includes(currentUserId));
      
      // Check if user is a moderator
      setIsModerator(communityData.moderators.includes(currentUserId));
      
      // Check if user is the creator
      setIsCreator(communityData.creatorId === currentUserId);
      
      // Get community members
      const membersResponse = await axios.get(`http://localhost:8080/communities/${id}/members`);
      setMembers(membersResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching community details:', err);
      setError('Failed to load community details. Please try again.');
      setLoading(false);
    }
  };
  
  const fetchCommunityPosts = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/communities/${id}/posts`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching community posts:', err);
      // Don't set error here to avoid blocking the entire page if just posts fail to load
    }
  };
  
  const handleJoinCommunity = async () => {
    try {
      await axios.post(`http://localhost:8080/communities/${communityId}/join?userId=${userId}`);
      
      // Refresh community data
      fetchCommunityDetails(communityId, userId);
    } catch (err) {
      console.error('Error joining community:', err);
      setError('Failed to join community. Please try again.');
    }
  };
  
  const handleLeaveCommunity = async () => {
    try {
      await axios.post(`http://localhost:8080/communities/${communityId}/leave?userId=${userId}`);
      
      // Refresh community data
      fetchCommunityDetails(communityId, userId);
    } catch (err) {
      console.error('Error leaving community:', err);
      setError('Failed to leave community. Please try again.');
    }
  };
  
  const handleDeleteCommunity = async () => {
    if (!window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/communities/${communityId}?userId=${userId}`);
      navigate('/communities');
    } catch (err) {
      console.error('Error deleting community:', err);
      setError('Failed to delete community. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="community-detail-loading">
        <div className="spinner"></div>
        <p>Loading community...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="community-detail-error">
        <p>{error}</p>
        <button 
          onClick={() => fetchCommunityDetails(communityId, userId)} 
          className="retry-btn"
        >
          Retry
        </button>
        <Link to="/communities" className="back-to-communities-btn">
          Back to Communities
        </Link>
      </div>
    );
  }
  
  if (!community) {
    return (
      <div className="community-not-found">
        <h2>Community Not Found</h2>
        <p>The community you're looking for doesn't exist or has been removed.</p>
        <Link to="/communities" className="back-to-communities-btn">
          Back to Communities
        </Link>
      </div>
    );
  }
  
  return (
    <div className="community-detail-container">
      <div className="community-header">
        <div className="community-cover-image">
          <div className="community-cover-placeholder">
            <span>{community.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        
        <div className="community-header-content">
          <div className="community-info-section">
            <h1 className="community-title">{community.name}</h1>
            <p className="community-description">{community.description}</p>
            <div className="community-meta">
              <span className="community-members-count">
                <i className="fas fa-users"></i> {community.memberCount} members
              </span>
              <span className="community-posts-count">
                <i className="fas fa-image"></i> {community.postCount} posts
              </span>
              <span className="community-created-by">
                Created by {community.creatorName}
              </span>
            </div>
          </div>
          
          <div className="community-actions">
            {!isMember && !isCreator ? (
              <button 
                className="join-community-btn" 
                onClick={handleJoinCommunity}
              >
                Join Community
              </button>
            ) : !isCreator ? (
              <button 
                className="leave-community-btn" 
                onClick={handleLeaveCommunity}
              >
                Leave Community
              </button>
            ) : null}
            
            {isModerator && (
              <Link 
                to={`/communities/${communityId}/edit`} 
                className="edit-community-btn"
              >
                Edit Community
              </Link>
            )}
            
            {isCreator && (
              <button 
                className="delete-community-btn" 
                onClick={handleDeleteCommunity}
              >
                Delete Community
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="community-content">
        <div className="community-tabs">
          <button 
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members ({community.memberCount})
          </button>
          <button 
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          
          {isMember && (
            <Link 
              to={`/communities/${communityId}/create-post`} 
              className="create-post-btn"
            >
              Create Post
            </Link>
          )}
        </div>
        
        <div className="community-tab-content">
          {activeTab === 'posts' && (
            <div className="community-posts">
              {posts.length === 0 ? (
                <div className="no-posts">
                  <p>No posts in this community yet.</p>
                  {isMember && (
                    <Link 
                      to={`/communities/${communityId}/create-post`} 
                      className="be-first-btn"
                    >
                      Be the first to post
                    </Link>
                  )}
                </div>
              ) : (
                <div className="posts-list">
                  {posts.map(post => (
                    <CommunityPost 
                      key={post.postId}
                      post={post}
                      currentUserId={userId}
                      isModerator={isModerator}
                      onPostDelete={(deletedPostId) => {
                        setPosts(prevPosts => prevPosts.filter(p => p.postId !== deletedPostId));
                        if (community) {
                          setCommunity({
                            ...community,
                            postCount: Math.max(0, community.postCount - 1)
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'members' && (
            <div className="community-members">
              <div className="members-list">
                {members.map(member => (
                  <div key={member.id} className="member-card">
                    <div 
                      className="member-avatar"
                      onClick={() => navigate(`/profile/${member.id}`)}
                    >
                      {member.profileImageUrl ? (
                        <img 
                          src={`http://localhost:8080/uploads/profiles/${member.profileImageUrl}`} 
                          alt={member.fullname}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50?text=User';
                          }}
                        />
                      ) : (
                        <div className="member-avatar-placeholder">
                          {member.fullname.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="member-info">
                      <h3 
                        className="member-name"
                        onClick={() => navigate(`/profile/${member.id}`)}
                      >
                        {member.fullname}
                      </h3>
                      <div className="member-role">
                        {member.isCreator && (
                          <span className="creator-badge">Creator</span>
                        )}
                        {member.isModerator && !member.isCreator && (
                          <span className="moderator-badge">Moderator</span>
                        )}
                        {!member.isModerator && !member.isCreator && (
                          <span className="member-badge">Member</span>
                        )}
                      </div>
                    </div>
                    
                    {isCreator && !member.isCreator && (
                      <div className="member-actions">
                        {!member.isModerator ? (
                          <button 
                            className="make-moderator-btn"
                            onClick={async () => {
                              try {
                                await axios.post(
                                  `http://localhost:8080/communities/${communityId}/moderators?adminUserId=${userId}&newModeratorId=${member.id}`
                                );
                                fetchCommunityDetails(communityId, userId);
                              } catch (err) {
                                console.error('Error making moderator:', err);
                                setError('Failed to update moderator status.');
                              }
                            }}
                          >
                            Make Moderator
                          </button>
                        ) : (
                          <button 
                            className="remove-moderator-btn"
                            onClick={async () => {
                              try {
                                await axios.delete(
                                  `http://localhost:8080/communities/${communityId}/moderators/${member.id}?adminUserId=${userId}`
                                );
                                fetchCommunityDetails(communityId, userId);
                              } catch (err) {
                                console.error('Error removing moderator:', err);
                                setError('Failed to update moderator status.');
                              }
                            }}
                          >
                            Remove as Moderator
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="community-about">
              <div className="about-section">
                <h2>About this Community</h2>
                <p>{community.description}</p>
                
                <div className="community-details">
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {new Date(community.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Creator:</span>
                    <span className="detail-value">{community.creatorName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Members:</span>
                    <span className="detail-value">{community.memberCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Posts:</span>
                    <span className="detail-value">{community.postCount}</span>
                  </div>
                </div>
                
                <div className="moderators-section">
                  <h3>Moderators</h3>
                  <div className="moderators-list">
                    {members
                      .filter(member => member.isModerator)
                      .map(moderator => (
                        <div 
                          key={moderator.id} 
                          className="moderator-item"
                          onClick={() => navigate(`/profile/${moderator.id}`)}
                        >
                          <div className="moderator-avatar">
                            {moderator.profileImageUrl ? (
                              <img 
                                src={`http://localhost:8080/uploads/profiles/${moderator.profileImageUrl}`} 
                                alt={moderator.fullname}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/40?text=User';
                                }}
                              />
                            ) : (
                              <div className="moderator-avatar-placeholder">
                                {moderator.fullname.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="moderator-name">
                            {moderator.fullname}
                            {moderator.isCreator && (
                              <span className="creator-tag">(Creator)</span>
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityDetail;
