import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditCommunityPost.css';

function EditCommunityPost() {
  const { communityId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    fetchPostDetails(postId);
  }, [postId, navigate]);
  
  const fetchPostDetails = async (id) => {
    try {
      setLoading(true);
      
      // Get post details
      const response = await axios.get(`http://localhost:8080/communities/posts/${id}`);
      const postData = response.data;
      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
      
      if (postData.imageUrl) {
        setImagePreview(`http://localhost:8080/uploads/community-posts/${postData.imageUrl}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching post details:', err);
      setError('Failed to load post details. Please try again.');
      setLoading(false);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Post title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Post content is required');
      return;
    }
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Update the post
      const updateData = {
        userId,
        title,
        content
      };
      
      await axios.put(`http://localhost:8080/communities/posts/${postId}`, updateData);
      
      // If we have a new image, upload it
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('userId', userId);
        
        await axios.post(
          `http://localhost:8080/communities/posts/${postId}/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      // Navigate back to the community page
      navigate(`/communities/${communityId}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="edit-post-loading">
        <div className="spinner"></div>
        <p>Loading post details...</p>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="post-not-found">
        <h2>Post Not Found</h2>
        <p>The post you're trying to edit doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate(`/communities/${communityId}`)} 
          className="back-to-community-btn"
        >
          Back to Community
        </button>
      </div>
    );
  }
  
  return (
    <div className="edit-community-post-container">
      <div className="edit-post-card">
        <h1>Edit Post</h1>
        <p className="edit-post-subtitle">
          Update your post in {post.communityName || 'the community'}
        </p>
        
        {error && (
          <div className="edit-post-error">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-post-form">
          <div className="form-group">
            <label htmlFor="post-title">Title *</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title"
              maxLength="100"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-content">Content *</label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share with the community?"
              maxLength="5000"
              rows="8"
              required
            />
            <small className="character-count">
              {content.length}/5000 characters
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="post-image">Image (Optional)</label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            
            {!imagePreview && (
              <>
                <input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <label htmlFor="post-image" className="file-input-label">
                  Choose Image
                </label>
              </>
            )}
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/communities/${communityId}`)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading-spinner"></span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCommunityPost;
