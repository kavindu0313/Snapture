import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminFeedback.css";

function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalCount: 0,
    newCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
    closedCount: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...feedbackList];
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(feedback => feedback.status.toLowerCase() === statusFilter);
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(feedback => feedback.category === categoryFilter);
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(feedback => 
        feedback.subject.toLowerCase().includes(query) || 
        feedback.message.toLowerCase().includes(query) ||
        feedback.userName.toLowerCase().includes(query)
      );
    }
    
    setFilteredFeedback(filtered);
  }, [feedbackList, statusFilter, categoryFilter, searchQuery]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      setTimeout(() => {
        // Simulated feedback data
        const mockFeedback = [
          {
            id: 1,
            userId: 101,
            userName: "John Smith",
            userEmail: "john.smith@example.com",
            category: "Performance",
            subject: "App Performance Issue",
            message: "The app seems to be slow when loading images in the feed. I've noticed this particularly when scrolling through many high-resolution photos.",
            rating: 3,
            status: "In Progress",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            adminResponse: "We're investigating the performance issue and will release an update soon.",
            adminName: "Support Team",
            responseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            userId: 102,
            userName: "Emily Johnson",
            userEmail: "emily.johnson@example.com",
            category: "Features",
            subject: "Feature Request: Dark Mode",
            message: "It would be great to have a dark mode option in the app. This would help reduce eye strain when using the app at night.",
            rating: 4,
            status: "New",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            userId: 103,
            userName: "Michael Brown",
            userEmail: "michael.brown@example.com",
            category: "Bug Report",
            subject: "Login Issue on Mobile",
            message: "I'm having trouble logging in on my mobile device. The app crashes after I enter my credentials.",
            rating: 2,
            status: "New",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            userId: 104,
            userName: "Sarah Wilson",
            userEmail: "sarah.wilson@example.com",
            category: "UI/UX",
            subject: "Confusing Navigation",
            message: "The navigation menu is a bit confusing. It's hard to find certain features like the learning plans.",
            rating: 3,
            status: "Resolved",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            adminResponse: "Thank you for your feedback. We've redesigned the navigation menu in our latest update to make it more intuitive.",
            adminName: "Design Team",
            responseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            userId: 105,
            userName: "David Lee",
            userEmail: "david.lee@example.com",
            category: "Other",
            subject: "General Appreciation",
            message: "I just wanted to say that I love the app! It's been really helpful for improving my photography skills.",
            rating: 5,
            status: "Closed",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            adminResponse: "Thank you for your kind words! We're glad you're enjoying the app.",
            adminName: "Community Manager",
            responseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setFeedbackList(mockFeedback);
        setFilteredFeedback(mockFeedback);
        setLoading(false);
      }, 1000);
      
      // In a real app, you would use:
      // const response = await axios.get('http://localhost:8080/feedback');
      // setFeedbackList(response.data);
      // setFilteredFeedback(response.data);
      // setLoading(false);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback data. Please try again later.");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      setTimeout(() => {
        // Simulated stats data
        const mockStats = {
          totalCount: 5,
          newCount: 2,
          inProgressCount: 1,
          resolvedCount: 1,
          closedCount: 1,
          averageRating: 3.4,
          uiUxCount: 1,
          featuresCount: 1,
          performanceCount: 1,
          bugReportCount: 1,
          otherCount: 1,
          uiUxRating: 3.0,
          featuresRating: 4.0,
          performanceRating: 3.0,
          bugReportRating: 2.0,
          otherRating: 5.0
        };
        
        setStats(mockStats);
      }, 1000);
      
      // In a real app, you would use:
      // const response = await axios.get('http://localhost:8080/feedback/stats');
      // setStats(response.data);
    } catch (err) {
      console.error("Error fetching feedback stats:", err);
    }
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      
      // Update the feedback list
      const updatedList = feedbackList.map(feedback => {
        if (feedback.id === feedbackId) {
          return { ...feedback, status: newStatus };
        }
        return feedback;
      });
      
      setFeedbackList(updatedList);
      
      // If the selected feedback is being updated, update it too
      if (selectedFeedback && selectedFeedback.id === feedbackId) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }
      
      // Update stats
      fetchStats();
      
      // In a real app, you would use:
      // await axios.put(`http://localhost:8080/feedback/${feedbackId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Error updating feedback status:", err);
      alert("Failed to update feedback status. Please try again.");
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedFeedback || !adminResponse.trim()) {
      alert("Please enter a response before submitting.");
      return;
    }
    
    setResponseLoading(true);
    
    try {
      // Get admin info (in a real app, this would come from auth context)
      const adminId = 1;
      const adminName = "Admin User";
      
      // In a real app, this would be an API call
      // For now, we'll simulate it
      setTimeout(() => {
        // Update the feedback list
        const updatedList = feedbackList.map(feedback => {
          if (feedback.id === selectedFeedback.id) {
            return {
              ...feedback,
              adminResponse,
              adminName,
              responseDate: new Date().toISOString(),
              status: "Resolved"
            };
          }
          return feedback;
        });
        
        setFeedbackList(updatedList);
        
        // Update the selected feedback
        setSelectedFeedback({
          ...selectedFeedback,
          adminResponse,
          adminName,
          responseDate: new Date().toISOString(),
          status: "Resolved"
        });
        
        setResponseSuccess(true);
        setResponseLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setResponseSuccess(false);
        }, 3000);
        
        // Update stats
        fetchStats();
      }, 1000);
      
      // In a real app, you would use:
      // await axios.put(`http://localhost:8080/feedback/${selectedFeedback.id}/respond`, {
      //   adminResponse,
      //   adminId,
      //   adminName
      // });
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Failed to submit response. Please try again.");
      setResponseLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return '#007bff';
      case 'in progress':
        return '#ffc107';
      case 'resolved':
        return '#28a745';
      case 'closed':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="admin-feedback-container">
      <div className="admin-feedback-header">
        <h1>Feedback Management</h1>
        <p>View and respond to user feedback</p>
      </div>
      
      <div className="admin-feedback-stats">
        <div className="stats-card total">
          <h3>Total Feedback</h3>
          <div className="stats-value">{stats.totalCount}</div>
        </div>
        
        <div className="stats-card new">
          <h3>New</h3>
          <div className="stats-value">{stats.newCount}</div>
        </div>
        
        <div className="stats-card in-progress">
          <h3>In Progress</h3>
          <div className="stats-value">{stats.inProgressCount}</div>
        </div>
        
        <div className="stats-card resolved">
          <h3>Resolved</h3>
          <div className="stats-value">{stats.resolvedCount}</div>
        </div>
        
        <div className="stats-card closed">
          <h3>Closed</h3>
          <div className="stats-value">{stats.closedCount}</div>
        </div>
        
        <div className="stats-card rating">
          <h3>Avg. Rating</h3>
          <div className="stats-value">
            <span>{stats.averageRating.toFixed(1)}</span>
            <div className="simple-star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`star ${star <= Math.round(stats.averageRating) ? 'filled' : 'empty'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="admin-feedback-content">
        <div className="admin-feedback-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fa fa-search"></i>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Features">Features</option>
              <option value="Performance">Performance</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <button className="refresh-button" onClick={fetchFeedback}>
            <i className="fa fa-sync-alt"></i> Refresh
          </button>
        </div>
        
        <div className="admin-feedback-main">
          <div className="feedback-list-container">
            <h2>Feedback List</h2>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading feedback...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchFeedback}>Try Again</button>
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="empty-container">
                <p>No feedback found matching your filters.</p>
              </div>
            ) : (
              <div className="feedback-list">
                {filteredFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`feedback-item ${selectedFeedback && selectedFeedback.id === feedback.id ? 'selected' : ''}`}
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    <div className="feedback-item-header">
                      <div className="feedback-item-title">
                        <span className="feedback-category">{feedback.category}</span>
                        <h3>{feedback.subject}</h3>
                      </div>
                      <div 
                        className="feedback-status"
                        style={{ backgroundColor: getStatusColor(feedback.status) + '20', color: getStatusColor(feedback.status) }}
                      >
                        {feedback.status}
                      </div>
                    </div>
                    
                    <div className="feedback-item-preview">
                      <p>{feedback.message.substring(0, 100)}...</p>
                    </div>
                    
                    <div className="feedback-item-meta">
                      <div className="feedback-user">
                        <i className="fa fa-user"></i>
                        <span>{feedback.userName}</span>
                      </div>
                      <div className="feedback-rating">
                        <div className="simple-star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`star ${star <= feedback.rating ? 'filled' : 'empty'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="feedback-date">
                        <i className="fa fa-calendar-alt"></i>
                        <span>{formatDate(feedback.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="feedback-detail-container">
            {selectedFeedback ? (
              <div className="feedback-detail">
                <div className="feedback-detail-header">
                  <h2>{selectedFeedback.subject}</h2>
                  
                  <div className="feedback-detail-actions">
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) => handleStatusChange(selectedFeedback.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div className="feedback-detail-meta">
                  <div className="meta-item">
                    <span className="meta-label">From:</span>
                    <span className="meta-value">{selectedFeedback.userName} ({selectedFeedback.userEmail})</span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{selectedFeedback.category}</span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Date:</span>
                    <span className="meta-value">{formatDate(selectedFeedback.createdAt)}</span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Rating:</span>
                    <span className="meta-value">
                      <div className="simple-star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`star ${star <= selectedFeedback.rating ? 'filled' : 'empty'}`}>★</span>
                        ))}
                      </div>
                    </span>
                  </div>
                </div>
                
                <div className="feedback-detail-content">
                  <h3>Message</h3>
                  <p>{selectedFeedback.message}</p>
                </div>
                
                {selectedFeedback.adminResponse && (
                  <div className="admin-response-section">
                    <h3>Admin Response</h3>
                    <div className="admin-response-content">
                      <p>{selectedFeedback.adminResponse}</p>
                      <div className="response-meta">
                        <span>By {selectedFeedback.adminName}</span>
                        <span>on {formatDate(selectedFeedback.responseDate)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="response-form">
                  <h3>{selectedFeedback.adminResponse ? 'Update Response' : 'Add Response'}</h3>
                  
                  {responseSuccess && (
                    <div className="success-message">
                      <i className="fa fa-check-circle"></i>
                      <span>Response submitted successfully!</span>
                    </div>
                  )}
                  
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Enter your response to the user..."
                    rows={5}
                  ></textarea>
                  
                  <button 
                    className="submit-response-btn"
                    onClick={handleSubmitResponse}
                    disabled={responseLoading}
                  >
                    {responseLoading ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Select a feedback item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;
