import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Settings.css";

function Settings({ activeTab: initialActiveTab }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    profileVisibility: "public",
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: "english",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    category: "UI/UX",
    subject: "",
    message: "",
    rating: 0
  });
  const [userFeedback, setUserFeedback] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  const [activeTab, setActiveTab] = useState(initialActiveTab || "profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    const userFullName = localStorage.getItem("userFullName");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!userId) {
      // Redirect to login if not logged in
      navigate("/login");
    } else {
      // Load user data
      setFormData(prevData => ({
        ...prevData,
        fullName: userFullName || "",
        email: userEmail || ""
      }));
      
      // Here you would typically fetch additional user settings from your backend
      // For now, we're just using localStorage data
      
      // Fetch user's previous feedback if on feedback tab
      if (activeTab === "feedback") {
        fetchUserFeedback(userId);
      }
    }
  }, [navigate, activeTab]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update localStorage with new values
      localStorage.setItem("userFullName", formData.fullName);
      localStorage.setItem("userEmail", formData.email);
      
      setMessage({
        text: "Profile settings updated successfully!",
        type: "success"
      });
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        text: "New passwords do not match!",
        type: "error"
      });
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({
        text: "Password must be at least 8 characters long!",
        type: "error"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({
        text: "Password updated successfully!",
        type: "success"
      });
      setIsLoading(false);
      
      // Clear password fields
      setFormData(prevData => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }, 1000);
  };
  
  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({
        text: "Privacy settings updated successfully!",
        type: "success"
      });
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }, 1000);
  };
  
  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({
        text: "Notification settings updated successfully!",
        type: "success"
      });
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }, 1000);
  };
  
  const handleAppearanceSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({
        text: "Appearance settings updated successfully!",
        type: "success"
      });
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }, 1000);
  };
  
  // Feedback related functions
  const fetchUserFeedback = async (userId) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it
      setTimeout(() => {
        // Simulated feedback data
        const mockFeedback = [
          {
            id: 1,
            subject: "App Performance Issue",
            category: "Performance",
            message: "The app seems to be slow when loading images in the feed.",
            rating: 3,
            status: "In Progress",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            adminResponse: "We're investigating the performance issue and will release an update soon.",
            adminName: "Support Team",
            responseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            subject: "Feature Request",
            category: "Features",
            message: "It would be great to have a dark mode option in the app.",
            rating: 4,
            status: "New",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setUserFeedback(mockFeedback);
      }, 500);
      
      // In a real app, you would use:
      // const response = await axios.get(`http://localhost:8080/feedback/user/${userId}`);
      // setUserFeedback(response.data);
    } catch (err) {
      console.error("Error fetching user feedback:", err);
    }
  };
  
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleRatingChange = (newRating) => {
    setFeedbackData(prevData => ({
      ...prevData,
      rating: newRating
    }));
  };
  
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!feedbackData.subject || !feedbackData.message || feedbackData.rating === 0) {
      setMessage({
        text: "Please fill in all required fields and provide a rating.",
        type: "error"
      });
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    // Get user details from localStorage
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userFullName");
    const userEmail = localStorage.getItem("userEmail");
    
    // Prepare feedback data
    const feedback = {
      ...feedbackData,
      userId,
      userName,
      userEmail
    };
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would use:
      // await axios.post('http://localhost:8080/feedback', feedback);
      
      // Add the new feedback to the list with a simulated ID and timestamp
      const newFeedback = {
        ...feedback,
        id: userFeedback.length + 1,
        status: "New",
        createdAt: new Date().toISOString()
      };
      
      setUserFeedback([newFeedback, ...userFeedback]);
      
      // Reset form
      setFeedbackData({
        category: "UI/UX",
        subject: "",
        message: "",
        rating: 0
      });
      
      setMessage({
        text: "Thank you for your feedback! We appreciate your input.",
        type: "success"
      });
      
      setIsSubmittingFeedback(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }, 1000);
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
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
    
    // Redirect to splash page
    navigate("/");
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Clear user data from localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userFullName");
        localStorage.removeItem("userEmail");
        
        // Redirect to splash page
        navigate("/");
      }, 1000);
    }
  };
  
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="settings-content">
        <div className="settings-sidebar">
          
          <button 
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="fa fa-user"></i>
            Profile
          </button>
          
          <button 
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            <i className="fa fa-lock"></i>
            Password
          </button>
          
          <button
            className={`tab-button ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <i className="fa fa-user-circle"></i>
            Account
          </button>
          
          <button
            className={`tab-button ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            <i className="fa fa-comment"></i>
            Feedback
          </button>
          
          <button 
            className={`tab-button ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <i className="fa fa-palette"></i>
            Appearance
          </button>
          
        </div>
        
        <div className="settings-main">
          {activeTab === "profile" && (
            <div className="settings-panel">
              <h2>Profile Information</h2>
              <p>Update your personal information</p>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === "password" && (
            <div className="settings-panel">
              <h2>Password</h2>
              <p>Update your password</p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === "privacy" && (
            <div className="settings-panel">
              <h2>Privacy Settings</h2>
              <p>Control your privacy preferences</p>
              
              <form onSubmit={handlePrivacySubmit}>
                <div className="form-group">
                  <label>Profile Visibility</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={formData.profileVisibility === "public"}
                        onChange={handleChange}
                      />
                      Public - Anyone can see your profile
                    </label>
                    
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="followers"
                        checked={formData.profileVisibility === "followers"}
                        onChange={handleChange}
                      />
                      Followers Only - Only people who follow you can see your profile
                    </label>
                    
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={formData.profileVisibility === "private"}
                        onChange={handleChange}
                      />
                      Private - Only you can see your profile
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === "notifications" && (
            <div className="settings-panel">
              <h2>Notification Settings</h2>
              <p>Control how you receive notifications</p>
              
              <form onSubmit={handleNotificationSubmit}>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                    />
                    Email Notifications
                  </label>
                  <p className="help-text">Receive notifications via email</p>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onChange={handleChange}
                    />
                    Push Notifications
                  </label>
                  <p className="help-text">Receive notifications in your browser</p>
                </div>
                
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === "appearance" && (
            <div className="settings-panel">
              <h2>Appearance Settings</h2>
              <p>Customize how Snapture looks</p>
              
              <form onSubmit={handleAppearanceSubmit}>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={formData.darkMode}
                      onChange={handleChange}
                    />
                    Dark Mode
                  </label>
                  <p className="help-text">Use dark theme throughout the application</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>
                
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
          
          {activeTab === "account" && (
            <div className="settings-panel">
              <h2>Account Settings</h2>
              <p>Manage your account</p>
              
              <div className="account-actions">
                <button className="logout-button" onClick={handleLogout}>
                  <i className="fa fa-sign-out-alt"></i>
                  Logout
                </button>
                
                <button className="delete-button" onClick={handleDeleteAccount}>
                  <i className="fa fa-trash"></i>
                  Delete Account
                </button>
              </div>
              
              <div className="account-info">
                <h3>Account Information</h3>
                <p><strong>Account Created:</strong> May 18, 2025</p>
                <p><strong>Account Type:</strong> Standard</p>
                <p><strong>Account Status:</strong> Active</p>
              </div>
            </div>
          )}
          
          {activeTab === "feedback" && (
            <div className="settings-panel">
              <h2>Feedback & Suggestions</h2>
              <p>We value your feedback! Please share your thoughts to help us improve Snapture.</p>
              
              <div className="feedback-content">
                <div className="feedback-form-container">
                  <h3>Submit Feedback</h3>
                  
                  <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select 
                        id="category"
                        name="category"
                        value={feedbackData.category}
                        onChange={handleFeedbackChange}
                        required
                      >
                        <option value="UI/UX">UI/UX</option>
                        <option value="Features">Features</option>
                        <option value="Performance">Performance</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input 
                        type="text"
                        id="subject"
                        name="subject"
                        value={feedbackData.subject}
                        onChange={handleFeedbackChange}
                        placeholder="Brief summary of your feedback"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea 
                        id="message"
                        name="message"
                        value={feedbackData.message}
                        onChange={handleFeedbackChange}
                        placeholder="Please provide detailed feedback..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="form-group rating-group">
                      <label>Rate Your Experience</label>
                      <div className="rating-container">
                        <div className="simple-star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={`star ${star <= feedbackData.rating ? 'filled' : 'empty'}`}
                              onClick={() => handleRatingChange(star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="rating-text">
                          {feedbackData.rating > 0 ? `${feedbackData.rating} out of 5 stars` : 'Please select a rating'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="save-button"
                      disabled={isSubmittingFeedback}
                    >
                      {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </form>
                </div>
                
                {userFeedback.length > 0 && (
                  <div className="feedback-history-container">
                    <div className="history-header" onClick={() => setShowHistory(!showHistory)}>
                      <h3>Your Previous Feedback</h3>
                      <i className={`fa fa-chevron-${showHistory ? 'up' : 'down'}`}></i>
                    </div>
                    
                    {showHistory && (
                      <div className="feedback-history-list">
                        {userFeedback.map((feedback) => (
                          <div key={feedback.id} className="feedback-history-item">
                            <div className="feedback-history-header">
                              <div className="feedback-history-title">
                                <span className="feedback-category">{feedback.category}</span>
                                <h4>{feedback.subject}</h4>
                              </div>
                              <div className="feedback-status" data-status={feedback.status.toLowerCase().replace(/\s+/g, '-')}>
                                {feedback.status}
                              </div>
                            </div>
                            
                            <div className="feedback-history-content">
                              <p>{feedback.message}</p>
                              
                              <div className="feedback-history-meta">
                                <div className="feedback-date">
                                  <i className="fa fa-calendar-alt"></i>
                                  <span>{formatDate(feedback.createdAt)}</span>
                                </div>
                                
                                <div className="feedback-rating">
                                  {/* Simple star rating display */}
                                  <div className="simple-star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span key={star} className={`star ${star <= feedback.rating ? 'filled' : 'empty'}`}>★</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {feedback.adminResponse && (
                              <div className="admin-response">
                                <h4>Response from {feedback.adminName || 'Admin'}</h4>
                                <p>{feedback.adminResponse}</p>
                                <div className="response-date">
                                  <i className="fa fa-reply"></i>
                                  <span>{formatDate(feedback.responseDate)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="feedback-faq">
                <h3>Frequently Asked Questions</h3>
                
                <div className="faq-item">
                  <h4>How long will it take to get a response?</h4>
                  <p>We typically respond to feedback within 2-3 business days. Complex issues may take longer to address.</p>
                </div>
                
                <div className="faq-item">
                  <h4>What happens after I submit feedback?</h4>
                  <p>Our team reviews all feedback and categorizes it based on priority. You'll receive a notification when we respond to your feedback.</p>
                </div>
                
                <div className="faq-item">
                  <h4>Can I suggest new features?</h4>
                  <p>Absolutely! We love hearing about features you'd like to see in Snapture. Select the "Features" category when submitting your feedback.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
