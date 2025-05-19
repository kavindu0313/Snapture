import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCommunity.css';

function CreateCommunity() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
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
      setLoading(true);
      setError(null);
      
      // First create the community
      const communityData = {
        name,
        description,
        creatorId: userId
      };
      
      const response = await axios.post('http://localhost:8080/communities', communityData);
      const newCommunity = response.data;
      
      // If we have a cover image, upload it
      if (coverImage) {
        try {
          const formData = new FormData();
          formData.append('file', coverImage);
          formData.append('userId', userId);
          
          console.log('Uploading cover image for community:', newCommunity.communityId);
          console.log('Form data:', formData);
          
          const uploadResponse = await axios.post(
            `http://localhost:8080/communities/${newCommunity.communityId}/cover-image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          console.log('Cover image upload response:', uploadResponse.data);
        } catch (uploadError) {
          console.error('Error uploading cover image:', uploadError);
          // Continue even if image upload fails
        }
      }
      
      // Navigate to the new community page
      navigate(`/communities/${newCommunity.communityId}`);
    } catch (err) {
      console.error('Error creating community:', err);
      setError(err.response?.data?.message || 'Failed to create community. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="create-community-container">
      <div className="create-community-card">
        <h1>Create a New Community</h1>
        <p className="create-community-subtitle">
          Create a community to connect with other photographers and share your work
        </p>
        
        {error && (
          <div className="create-community-error">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="create-community-form">
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
                <img src={coverImagePreview} alt="Cover preview" />
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
              Choose File
            </label>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/communities')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Create Community'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
