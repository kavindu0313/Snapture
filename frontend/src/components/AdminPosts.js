import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPosts.css';

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch posts data
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Get posts from the real API
      const response = await axios.get('http://localhost:8080/posts');
      
      // Filter by search term if provided
      let filteredPosts = response.data || [];
      
      // Apply status filter
      if (filterStatus !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === filterStatus);
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          (post.title && post.title.toLowerCase().includes(searchLower)) ||
          (post.description && post.description.toLowerCase().includes(searchLower)) ||
          (post.author && post.author.toLowerCase().includes(searchLower)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      // Calculate pagination
      const pageSize = 10;
      const total = filteredPosts.length;
      const totalPgs = Math.ceil(total / pageSize);
      setTotalPages(totalPgs);
      
      // Apply pagination
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      setPosts(paginatedPosts);
      setLoading(false);
    } catch (err) {
      setError('Error fetching posts data');
      setLoading(false);
      console.error(err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchPosts();
  }, [currentPage, filterStatus]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchPosts();
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(0); // Reset to first page on filter change
  };

  // Open view modal
  const openViewModal = (post) => {
    setCurrentPost(post);
    setShowViewModal(true);
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        // Delete post using the real API
        await axios.delete(`http://localhost:8080/posts/${postId}`);
        console.log(`Deleted post ${postId}`);
        fetchPosts();
      } catch (err) {
        setError('Error deleting post');
        console.error(err);
      }
    }
  };

  // Handle change post status
  const handleChangeStatus = async (postId, newStatus) => {
    try {
      // Update post status using the real API
      await axios.patch(`http://localhost:8080/posts/${postId}/status`, { status: newStatus });
      console.log(`Changed post ${postId} status to ${newStatus}`);
      fetchPosts();
    } catch (err) {
      setError('Error updating post status');
      console.error(err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageButtons = [];
    const maxVisiblePages = 5;
    
    // Previous button
    pageButtons.push(
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
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // Show limited pages with ellipsis
      let startPage = Math.max(0, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage === 0) {
        endPage = 2;
      } else if (currentPage === totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // First page
      if (startPage > 0) {
        pageButtons.push(
          <button
            key={0}
            className={`pagination-btn ${currentPage === 0 ? 'active' : ''}`}
            onClick={() => setCurrentPage(0)}
          >
            1
          </button>
        );
        
        // Ellipsis after first page
        if (startPage > 1) {
          pageButtons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
        }
      }
      
      // Middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      }
      
      // Ellipsis before last page
      if (endPage < totalPages - 2) {
        pageButtons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      
      // Last page
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <button
            key={totalPages - 1}
            className={`pagination-btn ${currentPage === totalPages - 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(totalPages - 1)}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    // Next button
    pageButtons.push(
      <button 
        key="next" 
        className="pagination-btn"
        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );
    
    return (
      <div className="pagination">
        {pageButtons}
      </div>
    );
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge active';
      case 'inactive':
        return 'status-badge inactive';
      case 'flagged':
        return 'status-badge flagged';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="admin-posts">
      <div className="posts-header">
        <h2>Post Management</h2>
      </div>
      
      {/* Search and filter */}
      <div className="posts-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
        
        <div className="filter-container">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter" 
            className="filter-select"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="all">All Posts</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <div className="loading-indicator">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading posts...</span>
        </div>
      ) : (
        <div className="posts-content">
          {posts.length === 0 ? (
            <div className="no-posts-message">
              <i className="fas fa-info-circle"></i>
              <span>No posts found. Try adjusting your search or filters.</span>
            </div>
          ) : (
            <div className="posts-table-container">
              <table className="admin-table posts-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Likes</th>
                    <th>Actions</th>
                    <th>Status</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td className="post-title-cell">
                        <div className="post-title-with-image">
                          <span>{post.title}</span>
                        </div>
                      </td>
                      <td>{post.username || 'Unknown'}</td>
                      <td>{formatDate(post.createdAt)}</td>
                      <td>{post.likes || 0}</td>
                      <td>
                        <span className={getStatusBadgeClass(post.status || 'active')}>
                          {post.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="action-btn view-btn" 
                            title="View Post"
                            onClick={() => openViewModal(post)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {renderPagination()}
            </div>
          )}
        </div>
      )}
      
      {/* View Post Modal */}
      {showViewModal && currentPost && (
        <div className="modal-overlay">
          <div className="modal-content post-modal">
            <div className="modal-header">
              <h3>View Post</h3>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="post-details">
              <div className="post-image">
                {currentPost.imageUrl ? (
                  <img src={currentPost.imageUrl} alt={currentPost.title} />
                ) : (
                  <div className="no-image-placeholder">No image available</div>
                )}
              </div>
              
              <div className="post-info">
                <h4>{currentPost.title}</h4>
                <p className="post-meta">
                  <span>By {currentPost.author}</span>
                  <span>•</span>
                  <span>{formatDate(currentPost.date)}</span>
                </p>
                <p className="post-description">{currentPost.description}</p>
                
                <div className="post-stats">
                  <div className="stat-item">
                    <i className="fas fa-heart"></i>
                    <span>{currentPost.likes} likes</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-comment"></i>
                    <span>{currentPost.comments} comments</span>
                  </div>
                </div>
                
                <div className="post-tags">
                  {currentPost.tags && Array.isArray(currentPost.tags) ? (
                    currentPost.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))
                  ) : (
                    <span className="no-tags">No tags</span>
                  )}
                </div>
                
                <div className="post-status">
                  <span>Status: </span>
                  <span className={getStatusBadgeClass(currentPost.status)}>
                    {currentPost.status}
                  </span>
                </div>
                
                <div className="post-actions">
                  <button 
                    className="action-btn"
                    onClick={() => {
                      const newStatus = currentPost.status === 'active' ? 'inactive' : 'active';
                      handleChangeStatus(currentPost.id, newStatus);
                      setShowViewModal(false);
                    }}
                  >
                    {currentPost.status === 'active' ? 'Deactivate' : 'Activate'} Post
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => {
                      handleDeletePost(currentPost.id);
                      setShowViewModal(false);
                    }}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPosts;
