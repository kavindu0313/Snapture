import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './AdminCommunities.css';

function AdminCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    rules: '',
    coverImage: null
  });
  const [categories] = useState([
    'Portrait Photography',
    'Landscape Photography',
    'Street Photography',
    'Wildlife Photography',
    'Macro Photography',
    'Black and White',
    'Mobile Photography',
    'Travel Photography',
    'Architectural Photography',
    'Other'
  ]);

  // Fetch communities data
  const fetchCommunities = async () => {
    setLoading(true);
    try {
      // Get communities from the API
      const response = await axios.get('http://localhost:8080/communities');
      
      // Filter by search term if provided
      let filteredCommunities = response.data || [];
      if (searchTerm && filteredCommunities.length > 0) {
        const searchLower = searchTerm.toLowerCase();
        filteredCommunities = filteredCommunities.filter(community => 
          (community.name && community.name.toLowerCase().includes(searchLower)) ||
          (community.description && community.description.toLowerCase().includes(searchLower)) ||
          (community.category && community.category.toLowerCase().includes(searchLower))
        );
      }
      
      // Calculate pagination
      const pageSize = 10;
      const total = filteredCommunities.length;
      const totalPgs = Math.ceil(total / pageSize);
      setTotalPages(totalPgs);
      
      // Apply pagination
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const paginatedCommunities = filteredCommunities.slice(startIndex, endIndex);
      
      setCommunities(paginatedCommunities);
      setLoading(false);
    } catch (err) {
      setError('Error fetching communities data');
      setLoading(false);
      console.error(err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCommunities();
  }, [currentPage]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchCommunities();
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      coverImage: e.target.files[0]
    });
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      rules: '',
      coverImage: null
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (community) => {
    setCurrentCommunity(community);
    setFormData({
      name: community.name,
      description: community.description,
      category: community.category || '',
      rules: community.rules || '',
      coverImage: null
    });
    setShowEditModal(true);
  };

  // Handle add community
  const handleAddCommunity = async (e) => {
    e.preventDefault();
    
    try {
      const communityData = {
        id: Date.now().toString(), // Generate a mock ID
        name: formData.name,
        description: formData.description,
        category: formData.category,
        rules: formData.rules,
        createdBy: localStorage.getItem('adminId') || 'admin-123',
        createdAt: new Date().toISOString(),
        memberCount: 0,
        postCount: 0
      };
      
      await axios.post('http://localhost:8080/communities', communityData);
      console.log('Creating new community:', communityData);
      
      
      
      fetchCommunities();
      setShowAddModal(false);
    } catch (err) {
      setError('Error adding community');
      console.error(err);
    }
  };

  // Handle edit community
  const handleEditCommunity = async (e) => {
    e.preventDefault();
    
    try {
      const updatedData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        rules: formData.rules
      };
      
      // Update community
      await axios.put(`http://localhost:8080/communities/${currentCommunity.id}`, updatedData);
      
      fetchCommunities();
      setShowEditModal(false);
    } catch (err) {
      setError('Error updating community');
      console.error(err);
    }
  };

  // Handle delete community
  const handleDeleteCommunity = async (communityId) => {
    if (window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      try {
        // Delete community
        await axios.delete(`http://localhost:8080/communities/${communityId}`);
        fetchCommunities();
      } catch (err) {
        setError('Error deleting community');
        console.error(err);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        className="pagination-btn" 
        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    );
    
    // Page numbers
    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 || 
        i === totalPages - 1 || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button 
            key={i} 
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      } else if (
        i === currentPage - 2 || 
        i === currentPage + 2
      ) {
        pages.push(<span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>);
      }
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        className="pagination-btn" 
        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );
    
    return pages;
  };

  return (
    <div className="admin-communities">
      {/* Header with actions */}
      <div className="communities-header">
        <h2>Community Management</h2>
        <div className="communities-actions">
          <button className="add-btn" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Community
          </button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="communities-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search communities..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button onClick={() => setError('')} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Communities table */}
      <div className="communities-table-container">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading communities...</p>
          </div>
        ) : (
          <>
            <table className="communities-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Members</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {communities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-items">
                      No communities found
                    </td>
                  </tr>
                ) : (
                  communities.map(community => (
                    <tr key={community.id}>
                      <td>
                        <div className="community-name">
                          {community.coverImage ? (
                            <img 
                              src={`http://localhost:8080/uploads/${community.coverImage}`} 
                              alt={community.name}
                              className="community-thumbnail"
                            />
                          ) : (
                            <div className="community-icon">
                              {community.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span>{community.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{community.category || 'General'}</span>
                      </td>
                      <td>{community.memberCount || 0}</td>
                      <td>{formatDate(community.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${community.isActive !== false ? 'active' : 'inactive'}`}>
                          {community.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="action-btn view-btn" 
                            title="View Details"
                            onClick={() => window.open(`/communities/${community.id}`, '_blank')}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="action-btn edit-btn" 
                            title="Edit Community"
                            onClick={() => openEditModal(community)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete-btn" 
                            title="Delete Community"
                            onClick={() => handleDeleteCommunity(community.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {communities.length > 0 && (
              <div className="pagination">
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add Community Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Community</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddCommunity} className="community-form">
              <div className="form-group">
                <label htmlFor="name">Community Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="rules">Community Rules</label>
                <textarea 
                  id="rules" 
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="coverImage">Cover Image</label>
                <input 
                  type="file" 
                  id="coverImage" 
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Community Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Community</h3>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleEditCommunity} className="community-form">
              <div className="form-group">
                <label htmlFor="edit-name">Community Name</label>
                <input 
                  type="text" 
                  id="edit-name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea 
                  id="edit-description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-rules">Community Rules</label>
                <textarea 
                  id="edit-rules" 
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-coverImage">Cover Image</label>
                {currentCommunity.coverImage && (
                  <div className="current-image">
                    <img 
                      src={`http://localhost:8080/uploads/${currentCommunity.coverImage}`} 
                      alt={currentCommunity.name}
                    />
                    <p>Current cover image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  id="edit-coverImage" 
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCommunities;
