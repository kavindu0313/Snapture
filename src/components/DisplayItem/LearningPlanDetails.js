import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LearningPlanDetails.css";

function LearningPlanDetails() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            setUserId(currentUserId);
        }
        
        fetchLearningPlan();
    }, [planId]);

    const fetchLearningPlan = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/learning-plans/${planId}`);
            setPlan(response.data);
            
            // Check if current user is the owner
            if (response.data.userId === userId) {
                setIsOwner(true);
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching learning plan:", err);
            setError("Failed to load learning plan. It may have been deleted or doesn't exist.");
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            await axios.post(`http://localhost:8080/learning-plans/${planId}/like`);
            
            // Update the likes count in the UI
            setPlan(prevPlan => ({
                ...prevPlan,
                likes: prevPlan.likes + 1
            }));
        } catch (err) {
            console.error("Error liking learning plan:", err);
            alert("Failed to like learning plan. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this learning plan? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8080/learning-plans/${planId}`);
                alert("Learning plan deleted successfully!");
                navigate("/learning-plans");
            } catch (err) {
                console.error("Error deleting learning plan:", err);
                alert("Failed to delete learning plan. Please try again.");
            }
        }
    };

    const handleResourceStatusChange = async (index, completed) => {
        if (!isOwner) return;
        
        try {
            await axios.put(`http://localhost:8080/learning-plans/${planId}/resources/${index}/complete`, {
                completed: completed
            });
            
            // Update the resource status in the UI
            setPlan(prevPlan => {
                const updatedResources = [...prevPlan.resources];
                updatedResources[index].completed = completed;
                return {
                    ...prevPlan,
                    resources: updatedResources
                };
            });
            
            // Refresh the plan to get updated progress
            fetchLearningPlan();
        } catch (err) {
            console.error("Error updating resource status:", err);
            alert("Failed to update resource status. Please try again.");
        }
    };

    const handleMilestoneStatusChange = async (index, completed) => {
        if (!isOwner) return;
        
        try {
            await axios.put(`http://localhost:8080/learning-plans/${planId}/milestones/${index}/complete`, {
                completed: completed
            });
            
            // Update the milestone status in the UI
            setPlan(prevPlan => {
                const updatedMilestones = [...prevPlan.milestones];
                updatedMilestones[index].completed = completed;
                if (completed) {
                    updatedMilestones[index].completedDate = new Date().toISOString().split('T')[0];
                } else {
                    updatedMilestones[index].completedDate = null;
                }
                return {
                    ...prevPlan,
                    milestones: updatedMilestones
                };
            });
            
            // Refresh the plan to get updated progress
            fetchLearningPlan();
        } catch (err) {
            console.error("Error updating milestone status:", err);
            alert("Failed to update milestone status. Please try again.");
        }
    };

    const calculateProgress = () => {
        if (!plan || !plan.milestones || plan.milestones.length === 0) {
            return 0;
        }
        
        const completedCount = plan.milestones.filter(milestone => milestone.completed).length;
        return Math.round((completedCount / plan.milestones.length) * 100);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleString(undefined, options);
    };

    if (loading) {
        return (
            <div className="learning-plan-details-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading learning plan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learning-plan-details-container">
                <div className="error-message">
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchLearningPlan} className="retry-btn">
                            Retry
                        </button>
                        <Link to="/learning-plans" className="back-btn">
                            Back to Learning Plans
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="learning-plan-details-container">
                <div className="error-message">
                    <p>Learning plan not found.</p>
                    <Link to="/learning-plans" className="back-btn">
                        Back to Learning Plans
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="learning-plan-details-container">
            <div className="learning-plan-details-card">
                <div className="plan-header">
                    <div className="plan-title-section">
                        <h1>{plan.title}</h1>
                        <div className="plan-status-badge" data-status={plan.status.toLowerCase().replace(/\s+/g, '-')}>
                            {plan.status}
                        </div>
                    </div>
                    
                    <div className="plan-meta-info">
                        <div className="plan-creator">
                            <i className="fas fa-user"></i>
                            <span>Created by {plan.username || "Anonymous"}</span>
                        </div>
                        
                        <div className="plan-dates">
                            <div className="date-item">
                                <i className="fas fa-calendar-plus"></i>
                                <span>Created: {formatDateTime(plan.createdAt)}</span>
                            </div>
                            
                            <div className="date-item">
                                <i className="fas fa-calendar-check"></i>
                                <span>Last Updated: {formatDateTime(plan.updatedAt)}</span>
                            </div>
                            
                            {plan.targetCompletionDate && (
                                <div className="date-item">
                                    <i className="fas fa-flag-checkered"></i>
                                    <span>Target Completion: {formatDate(plan.targetCompletionDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="plan-actions-bar">
                    <div className="plan-social-actions">
                        <button className="like-btn" onClick={handleLike}>
                            <i className="fas fa-heart"></i>
                            <span>{plan.likes} {plan.likes === 1 ? 'Like' : 'Likes'}</span>
                        </button>
                    </div>
                    
                    {isOwner && (
                        <div className="plan-owner-actions">
                            <Link to={`/edit-learning-plan/${planId}`} className="edit-btn">
                                <i className="fas fa-edit"></i>
                                <span>Edit Plan</span>
                            </Link>
                            
                            <button className="delete-btn" onClick={handleDelete}>
                                <i className="fas fa-trash-alt"></i>
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="plan-progress-section">
                    <h2>Progress</h2>
                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${calculateProgress()}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{calculateProgress()}% Complete</span>
                    </div>
                </div>
                
                <div className="plan-content-grid">
                    <div className="plan-description-section">
                        <h2>Description</h2>
                        <p>{plan.description}</p>
                    </div>
                    
                    <div className="plan-goal-section">
                        <h2>Learning Goal</h2>
                        <p>{plan.goalDescription}</p>
                    </div>
                </div>
                
                {plan.topics && plan.topics.length > 0 && (
                    <div className="plan-topics-section">
                        <h2>Topics</h2>
                        <div className="topics-container">
                            {plan.topics.map((topic, index) => (
                                <div key={index} className="topic-tag">{topic}</div>
                            ))}
                        </div>
                    </div>
                )}
                
                {plan.resources && plan.resources.length > 0 && (
                    <div className="plan-resources-section">
                        <h2>Learning Resources</h2>
                        <div className="resources-list">
                            {plan.resources.map((resource, index) => (
                                <div key={index} className="resource-item">
                                    <div className="resource-info">
                                        <div className="resource-header">
                                            <span className="resource-type-badge">{resource.resourceType}</span>
                                            <h3 className="resource-name">{resource.resourceName}</h3>
                                        </div>
                                        
                                        {resource.resourceUrl && (
                                            <a 
                                                href={resource.resourceUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="resource-link"
                                            >
                                                <i className="fas fa-external-link-alt"></i> Visit Resource
                                            </a>
                                        )}
                                    </div>
                                    
                                    {isOwner && (
                                        <div className="resource-status">
                                            <label className="status-checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    checked={resource.completed} 
                                                    onChange={(e) => handleResourceStatusChange(index, e.target.checked)}
                                                />
                                                <span className="checkbox-label">Completed</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {plan.milestones && plan.milestones.length > 0 && (
                    <div className="plan-milestones-section">
                        <h2>Milestones</h2>
                        <div className="milestones-list">
                            {plan.milestones.map((milestone, index) => (
                                <div 
                                    key={index} 
                                    className={`milestone-item ${milestone.completed ? 'completed' : ''}`}
                                >
                                    <div className="milestone-info">
                                        <h3 className="milestone-name">{milestone.milestoneName}</h3>
                                        
                                        {milestone.description && (
                                            <p className="milestone-description">{milestone.description}</p>
                                        )}
                                        
                                        <div className="milestone-dates">
                                            {milestone.targetDate && (
                                                <div className="milestone-date">
                                                    <i className="fas fa-calendar-alt"></i>
                                                    <span>Target: {formatDate(milestone.targetDate)}</span>
                                                </div>
                                            )}
                                            
                                            {milestone.completed && milestone.completedDate && (
                                                <div className="milestone-date completed">
                                                    <i className="fas fa-check-circle"></i>
                                                    <span>Completed: {formatDate(milestone.completedDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {isOwner && (
                                        <div className="milestone-status">
                                            <label className="status-checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    checked={milestone.completed} 
                                                    onChange={(e) => handleMilestoneStatusChange(index, e.target.checked)}
                                                />
                                                <span className="checkbox-label">Mark as Completed</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="navigation-links">
                    <Link to="/learning-plans" className="nav-link">
                        <i className="fas fa-arrow-left"></i> Back to Learning Plans
                    </Link>
                    <Link to="/home" className="nav-link">
                        <i className="fas fa-home"></i> Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LearningPlanDetails;
