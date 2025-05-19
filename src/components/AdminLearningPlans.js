import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminLearningPlans.css';

function AdminLearningPlans() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goals: '',
    duration: '',
    difficulty: 'Beginner',
    resources: [],
    milestones: []
  });
  const [newResource, setNewResource] = useState({ title: '', link: '', type: 'Article' });
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', durationDays: 7 });
  const [difficulties] = useState(['Beginner', 'Intermediate', 'Advanced', 'Expert']);
  const [resourceTypes] = useState(['Article', 'Video', 'Book', 'Course', 'Tool', 'Other']);

  // Fetch learning plans data
  const fetchLearningPlans = async () => {
    setLoading(true);
    try {
      // Get learning plans from the API
      const response = await axios.get('http://localhost:8080/learning-plans');
      
      // Filter by search term if provided
      let filteredPlans = response.data || [];
      if (searchTerm && filteredPlans.length > 0) {
        const searchLower = searchTerm.toLowerCase();
        filteredPlans = filteredPlans.filter(plan => 
          (plan.title && plan.title.toLowerCase().includes(searchLower)) ||
          (plan.description && plan.description.toLowerCase().includes(searchLower)) ||
          (plan.difficulty && plan.difficulty.toLowerCase().includes(searchLower))
        );
      }
      
      // Calculate pagination
      const pageSize = 10;
      const total = filteredPlans.length;
      const totalPgs = Math.ceil(total / pageSize);
      setTotalPages(totalPgs);
      
      // Apply pagination
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, total);
      const paginatedPlans = filteredPlans.slice(startIndex, endIndex);
      
      setLearningPlans(paginatedPlans);
      setLoading(false);
    } catch (err) {
      setError('Error fetching learning plans data');
      setLoading(false);
      console.error(err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLearningPlans();
  }, [currentPage]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchLearningPlans();
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle resource input change
  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource({
      ...newResource,
      [name]: value
    });
  };

  // Handle milestone input change
  const handleMilestoneChange = (e) => {
    const { name, value } = e.target;
    setNewMilestone({
      ...newMilestone,
      [name]: name === 'durationDays' ? parseInt(value) : value
    });
  };

  // Add resource to form
  const addResource = () => {
    if (newResource.title && newResource.link) {
      setFormData({
        ...formData,
        resources: [...formData.resources, { ...newResource }]
      });
      setNewResource({ title: '', link: '', type: 'Article' });
    }
  };

  // Remove resource from form
  const removeResource = (index) => {
    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);
    setFormData({
      ...formData,
      resources: updatedResources
    });
  };

  // Add milestone to form
  const addMilestone = () => {
    if (newMilestone.title) {
      setFormData({
        ...formData,
        milestones: [...formData.milestones, { ...newMilestone }]
      });
      setNewMilestone({ title: '', description: '', durationDays: 7 });
    }
  };

  // Remove milestone from form
  const removeMilestone = (index) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones.splice(index, 1);
    setFormData({
      ...formData,
      milestones: updatedMilestones
    });
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      goals: '',
      duration: '',
      difficulty: 'Beginner',
      resources: [],
      milestones: []
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      goals: plan.goals || '',
      duration: plan.duration || '',
      difficulty: plan.difficulty || 'Beginner',
      resources: plan.resources || [],
      milestones: plan.milestones || []
    });
    setShowEditModal(true);
  };
  
  // Open view modal
  const openViewModal = (plan) => {
    setCurrentPlan(plan);
    setShowViewModal(true);
  };

  // Handle add learning plan
  const handleAddLearningPlan = async (e) => {
    e.preventDefault();
    
    try {
      const planData = {
        id: Date.now().toString(), // Generate a mock ID
        title: formData.title,
        description: formData.description,
        goals: formData.goals,
        duration: formData.duration,
        difficulty: formData.difficulty,
        resources: formData.resources,
        milestones: formData.milestones,
        createdBy: localStorage.getItem('adminId') || 'admin-123',
        createdAt: new Date().toISOString(),
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 0
      };
      
      // Create learning plan
      await axios.post('http://localhost:8080/learning-plans', planData);
      
      fetchLearningPlans();
      setShowAddModal(false);
    } catch (err) {
      setError('Error adding learning plan');
      console.error(err);
    }
  };

  // Handle edit learning plan
  const handleEditLearningPlan = async (e) => {
    e.preventDefault();
    
    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        goals: formData.goals,
        duration: formData.duration,
        difficulty: formData.difficulty,
        resources: formData.resources,
        milestones: formData.milestones
      };
      
      // Update learning plan
      await axios.put(`http://localhost:8080/learning-plans/${currentPlan.id}`, updatedData);
      
      fetchLearningPlans();
      setShowEditModal(false);
    } catch (err) {
      setError('Error updating learning plan');
      console.error(err);
    }
  };

  // Handle delete learning plan
  const handleDeleteLearningPlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this learning plan? This action cannot be undone.')) {
      try {
        // Delete learning plan
        await axios.delete(`http://localhost:8080/learning-plans/${planId}`);
        fetchLearningPlans();
      } catch (err) {
        // Check if it's a private learning plan
        if (err.response && err.response.status === 403) {
          alert('Cannot delete this private learning plan. Only the creator can delete it.');
        } else {
          setError('Error deleting learning plan');
        }
        console.error(err);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get difficulty class
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'beginner';
      case 'Intermediate':
        return 'intermediate';
      case 'Advanced':
        return 'advanced';
      case 'Expert':
        return 'expert';
      default:
        return 'beginner';
    }
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
    <div className="admin-learning-plans">
      {/* Header with actions */}
      <div className="learning-plans-header">
        <h2>Learning Plan Management</h2>
        <div className="learning-plans-actions">
          <button className="add-btn" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Learning Plan
          </button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="learning-plans-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search learning plans..." 
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
      
      {/* Learning plans table */}
      <div className="learning-plans-table-container">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading learning plans...</p>
          </div>
        ) : (
          <>
            <table className="learning-plans-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Resources</th>
                  <th>Milestones</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {learningPlans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-items">
                      No learning plans found
                    </td>
                  </tr>
                ) : (
                  learningPlans.map(plan => (
                    <tr key={plan.id}>
                      <td>
                        <div className="plan-title">{plan.title}</div>
                      </td>
                      <td>
                        <span className={`difficulty-badge ${getDifficultyClass(plan.difficulty)}`}>
                          {plan.difficulty || 'Beginner'}
                        </span>
                      </td>
                      <td>{plan.duration || 'Not specified'}</td>
                      <td>{plan.resources ? plan.resources.length : 0} resources</td>
                      <td>{plan.milestones ? plan.milestones.length : 0} milestones</td>
                      <td>{formatDate(plan.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="action-btn view-btn" 
                            title="View Details"
                            onClick={() => openViewModal(plan)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="action-btn edit-btn" 
                            title="Edit Plan"
                            onClick={() => openEditModal(plan)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete-btn" 
                            title="Delete Plan"
                            onClick={() => handleDeleteLearningPlan(plan.id)}
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
            {learningPlans.length > 0 && (
              <div className="pagination">
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add Learning Plan Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Learning Plan</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddLearningPlan} className="learning-plan-form">
              <div className="form-group">
                <label htmlFor="title">Plan Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <input 
                    type="text" 
                    id="duration" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 4 weeks"
                  />
                </div>
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
                <label htmlFor="goals">Goals</label>
                <textarea 
                  id="goals" 
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="What will learners achieve with this plan?"
                ></textarea>
              </div>
              
              {/* Resources Section */}
              <div className="form-section">
                <h4>Learning Resources</h4>
                
                <div className="resources-list">
                  {formData.resources.length === 0 ? (
                    <p className="no-items-message">No resources added yet</p>
                  ) : (
                    formData.resources.map((resource, index) => (
                      <div key={index} className="resource-item">
                        <div className="resource-details">
                          <div className="resource-title">{resource.title}</div>
                          <div className="resource-type">{resource.type}</div>
                          <div className="resource-link">
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                              {resource.link}
                            </a>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeResource(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="add-resource-form">
                  <div className="form-row">
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Resource Title"
                        name="title"
                        value={newResource.title}
                        onChange={handleResourceChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <select
                        name="type"
                        value={newResource.type}
                        onChange={handleResourceChange}
                      >
                        {resourceTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group flex-grow">
                      <input 
                        type="text" 
                        placeholder="Resource Link"
                        name="link"
                        value={newResource.link}
                        onChange={handleResourceChange}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="add-item-btn"
                      onClick={addResource}
                    >
                      Add Resource
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Milestones Section */}
              <div className="form-section">
                <h4>Learning Milestones</h4>
                
                <div className="milestones-list">
                  {formData.milestones.length === 0 ? (
                    <p className="no-items-message">No milestones added yet</p>
                  ) : (
                    formData.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-item">
                        <div className="milestone-details">
                          <div className="milestone-title">{milestone.title}</div>
                          <div className="milestone-duration">{milestone.durationDays} days</div>
                          <div className="milestone-description">{milestone.description}</div>
                        </div>
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeMilestone(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="add-milestone-form">
                  <div className="form-row">
                    <div className="form-group flex-grow">
                      <input 
                        type="text" 
                        placeholder="Milestone Title"
                        name="title"
                        value={newMilestone.title}
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <input 
                        type="number" 
                        placeholder="Days"
                        name="durationDays"
                        value={newMilestone.durationDays}
                        onChange={handleMilestoneChange}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group flex-grow">
                      <input 
                        type="text" 
                        placeholder="Milestone Description"
                        name="description"
                        value={newMilestone.description}
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="add-item-btn"
                      onClick={addMilestone}
                    >
                      Add Milestone
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Learning Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Learning Plan Modal */}
      {/* View Learning Plan Modal */}
      {showViewModal && currentPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Learning Plan Details</h3>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="plan-details">
              <div className="plan-header">
                <h4>{currentPlan.title}</h4>
                <div className="plan-meta">
                  <span className={`difficulty-badge ${getDifficultyClass(currentPlan.difficulty)}`}>
                    {currentPlan.difficulty || 'Beginner'}
                  </span>
                  <span className="duration">
                    <i className="fas fa-clock"></i> {currentPlan.duration || 'Not specified'}
                  </span>
                  <span className="created-date">
                    <i className="fas fa-calendar-alt"></i> Created on {formatDate(currentPlan.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="plan-section">
                <h5>Description</h5>
                <p>{currentPlan.description}</p>
              </div>
              
              {currentPlan.goals && (
                <div className="plan-section">
                  <h5>Learning Goals</h5>
                  <p>{currentPlan.goals}</p>
                </div>
              )}
              
              <div className="plan-section">
                <h5>Statistics</h5>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{currentPlan.enrollmentCount || 0}</div>
                    <div className="stat-label">Enrollments</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{currentPlan.completionCount || 0}</div>
                    <div className="stat-label">Completions</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{currentPlan.averageRating || 0}</div>
                    <div className="stat-label">Avg. Rating</div>
                  </div>
                </div>
              </div>
              
              {currentPlan.resources && currentPlan.resources.length > 0 && (
                <div className="plan-section">
                  <h5>Resources</h5>
                  <div className="resources-list">
                    {currentPlan.resources.map((resource, index) => (
                      <div key={index} className="resource-item">
                        <div className="resource-type">{resource.type}</div>
                        <div className="resource-title">{resource.title}</div>
                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentPlan.milestones && currentPlan.milestones.length > 0 && (
                <div className="plan-section">
                  <h5>Milestones</h5>
                  <div className="milestones-timeline">
                    {currentPlan.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-item">
                        <div className="milestone-marker">{index + 1}</div>
                        <div className="milestone-content">
                          <div className="milestone-title">{milestone.title}</div>
                          <div className="milestone-duration">{milestone.durationDays} days</div>
                          {milestone.description && (
                            <div className="milestone-description">{milestone.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="action-btn edit-btn" 
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(currentPlan);
                  }}
                >
                  <i className="fas fa-edit"></i> Edit Plan
                </button>
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this learning plan?')) {
                      handleDeleteLearningPlan(currentPlan.id);
                      setShowViewModal(false);
                    }
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Delete Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Learning Plan</h3>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleEditLearningPlan} className="learning-plan-form">
              <div className="form-group">
                <label htmlFor="edit-title">Plan Title</label>
                <input 
                  type="text" 
                  id="edit-title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-difficulty">Difficulty</label>
                  <select
                    id="edit-difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-duration">Duration</label>
                  <input 
                    type="text" 
                    id="edit-duration" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 4 weeks"
                  />
                </div>
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
                <label htmlFor="edit-goals">Goals</label>
                <textarea 
                  id="edit-goals" 
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="What will learners achieve with this plan?"
                ></textarea>
              </div>
              
              {/* Resources Section */}
              <div className="form-section">
                <h4>Learning Resources</h4>
                
                <div className="resources-list">
                  {formData.resources.length === 0 ? (
                    <p className="no-items-message">No resources added yet</p>
                  ) : (
                    formData.resources.map((resource, index) => (
                      <div key={index} className="resource-item">
                        <div className="resource-details">
                          <div className="resource-title">{resource.title}</div>
                          <div className="resource-type">{resource.type}</div>
                          <div className="resource-link">
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                              {resource.link}
                            </a>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeResource(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="add-resource-form">
                  <div className="form-row">
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Resource Title"
                        name="title"
                        value={newResource.title}
                        onChange={handleResourceChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <select
                        name="type"
                        value={newResource.type}
                        onChange={handleResourceChange}
                      >
                        {resourceTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group flex-grow">
                      <input 
                        type="text" 
                        placeholder="Resource Link"
                        name="link"
                        value={newResource.link}
                        onChange={handleResourceChange}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="add-item-btn"
                      onClick={addResource}
                    >
                      Add Resource
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Milestones Section */}
              <div className="form-section">
                <h4>Learning Milestones</h4>
                
                <div className="milestones-list">
                  {formData.milestones.length === 0 ? (
                    <p className="no-items-message">No milestones added yet</p>
                  ) : (
                    formData.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-item">
                        <div className="milestone-details">
                          <div className="milestone-title">{milestone.title}</div>
                          <div className="milestone-duration">{milestone.durationDays} days</div>
                          <div className="milestone-description">{milestone.description}</div>
                        </div>
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeMilestone(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="add-milestone-form">
                  <div className="form-row">
                    <div className="form-group flex-grow">
                      <input 
                        type="text" 
                        placeholder="Milestone Title"
                        name="title"
                        value={newMilestone.title}
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <input 
                        type="number" 
                        placeholder="Days"
                        name="durationDays"
                        value={newMilestone.durationDays}
                        onChange={handleMilestoneChange}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group flex-grow">
                      <input 
                        type="text" 
                        placeholder="Milestone Description"
                        name="description"
                        value={newMilestone.description}
                        onChange={handleMilestoneChange}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="add-item-btn"
                      onClick={addMilestone}
                    >
                      Add Milestone
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Learning Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLearningPlans;
