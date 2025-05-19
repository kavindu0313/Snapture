import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditCommunity.css';

function EditCommunity() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    fetchCommunityDetails(communityId, userId);
  }, [communityId, navigate]);
  
  const fetchCommunityDetails = async (id, userId) => {
    try {
      setLoading(true);
      
      // Get community details
      const response = await axios.get(`http://localhost:8080/communities/${id}`);
      const communityData = response.data;
      
      // Check if user is a moderator
      if (!communityData.moderators.includes(userId)) {
        setError('You do not have permission to edit this community');
        setLoading(false);
        return;
      }
      
      setCommunity(communityData);
      setName(communityData.name);
      setDescription(communityData.description);
      
      if (communityData.coverImageUrl) {
        setCoverImagePreview(`http://localhost:8080/uploads/communities/${communityData.coverImageUrl}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching community details:', err);
      setError('Failed to load community details. Please try again.');
      setLoading(false);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Community name is required');
      return;
    }
    
    if (!description.trim()) {
      setError('Community description is required');
      return;
    }
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Update community details
      const updateData = {
        userId,
        name,
        description
      };
      
      await axios.put(`http://localhost:8080/communities/${communityId}`, updateData);
      
      // If we have a new cover image, upload it
      if (coverImage) {
        const formData = new FormData();
        formData.append('file', coverImage);
        formData.append('userId', userId);
        
        await axios.post(
          `http://localhost:8080/communities/${communityId}/cover-image`,
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
      console.error('Error updating community:', err);
      setError(err.response?.data?.message || 'Failed to update community. Please try again.');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="edit-community-loading">
        <div className="spinner"></div>
        <p>Loading community details...</p>
      </div>
    );
  }
  
  if (error && !community) {
    return (
      <div className="edit-community-error">
        <p>{error}</p>
        <button 
          onClick={() => navigate(`/communities/${communityId}`)} 
          className="back-btn"
        >
          Back to Community
        </button>
      </div>
    );
  }
  
  return (
    <div className="edit-community-container">
      <div className="edit-community-card">
        <h1>Edit Community</h1>
        <p className="edit-community-subtitle">
          Update your community's information
        </p>
        
        {error && (
          <div className="edit-community-error-message">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-community-form">
          <div className="form-group">
            <label htmlFor="community-name">Community Name *</label>
            <input
              id="community-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your community"
              maxLength="50"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="community-description">Description *</label>
            <textarea
              id="community-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about?"
              maxLength="1000"
              rows="4"
              required
            />
            <small className="character-count">
              {description.length}/1000 characters
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="community-cover">Cover Image</label>
            <div className="cover-image-preview">
              {coverImagePreview ? (
                <img 
                  src={coverImagePreview} 
                  alt="Cover preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x200?text=Cover+Image';
                  }}
                />
              ) : (
                <div className="cover-image-placeholder">
                  <span>Select an image</span>
                </div>
              )}
            </div>
            <input
              id="community-cover"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="community-cover" className="file-input-label">
              Choose New Cover Image
            </label>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/communities/${communityId}`)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? (
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

export default EditCommunity;
