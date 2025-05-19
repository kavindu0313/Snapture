import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CommunityPost.css';

function CommunityPost({ post, currentUserId, isModerator, onPostDelete, onPostUpdate }) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleLikeToggle = async () => {
    try {
      setLoading(true);
      
      if (isLiked) {
        // Unlike the post
        await axios.delete(`http://localhost:8080/communities/posts/${post.postId}/like?userId=${currentUserId}`);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        // Like the post
        await axios.post(`http://localhost:8080/communities/posts/${post.postId}/like?userId=${currentUserId}`);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error toggling like:', err);
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8080/communities/posts/${post.postId}?userId=${currentUserId}`);
        if (onPostDelete) {
          onPostDelete(post.postId);
        }
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };
  
  const handleEdit = () => {
    navigate(`/communities/${post.communityId}/posts/${post.postId}/edit`);
  };
  
  const canModify = post.authorId === currentUserId || isModerator;
  
  return (
    <div className="community-post">
      <div className="post-header">
        <div className="post-author" onClick={() => navigate(`/profile/${post.authorId}`)}>
          {/* We don't have author profile image in the model, so using a placeholder */}
          <div className="author-avatar">
            <span>{post.authorName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="author-info">
            <h4 className="author-name">{post.authorName}</h4>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        {canModify && (
          <div className="post-options">
            <button 
              className="options-btn" 
              onClick={() => setShowOptions(!showOptions)}
            >
              <span className="options-icon">⋮</span>
            </button>
            
            {showOptions && (
              <div className="options-dropdown">
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <h3 className="post-title">{post.title}</h3>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      {post.imageUrl && (
        <div className="post-image">
          <div className="post-image-placeholder">
            <span>Image</span>
          </div>
        </div>
      )}
      
      <div className="post-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleLikeToggle}
          disabled={loading}
        >
          <span className="like-icon">❤</span>
          <span className="like-count">{likeCount}</span>
        </button>
        
        <button 
          className="comment-btn"
          onClick={() => navigate(`/communities/${post.communityId}/posts/${post.postId}`)}
        >
          <span className="comment-icon">💬</span>
          <span className="comment-count">{post.commentCount}</span>
        </button>
      </div>
    </div>
  );
}

export default CommunityPost;
