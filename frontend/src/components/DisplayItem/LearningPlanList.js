import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LearningPlanList.css";

function LearningPlanList() {
    const [learningPlans, setLearningPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // all, my-plans, public
    const [statusFilter, setStatusFilter] = useState("all"); // all, in-progress, completed, abandoned
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Check if user is logged in
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            setUserId(currentUserId);
        }
        
        fetchLearningPlans();
    }, [filter, statusFilter]);

    const fetchLearningPlans = async () => {
        setLoading(true);
        try {
            let url = "http://localhost:8080/learning-plans";
            
            // Apply filters
            if (filter === "my-plans") {
                if (!userId) {
                    alert("Please login to view your plans");
                    navigate("/login");
                    return;
                }
                url = `http://localhost:8080/learning-plans/user/${userId}`;
                
                if (statusFilter !== "all") {
                    url = `http://localhost:8080/learning-plans/user/${userId}/status/${statusFilter}`;
                }
            } else if (statusFilter !== "all") {
                url = `http://localhost:8080/learning-plans/status/${statusFilter}`;
            }
            
            const response = await axios.get(url);
            setLearningPlans(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching learning plans:", err);
            setError("Failed to load learning plans. Please try again later.");
            setLoading(false);
        }
    };

    const handleLike = async (planId) => {
        try {
            await axios.post(`http://localhost:8080/learning-plans/${planId}/like`);
            
            // Update the likes count in the UI
            setLearningPlans(prevPlans => 
                prevPlans.map(plan => 
                    plan.planId === planId 
                        ? { ...plan, likes: plan.likes + 1 } 
                        : plan
                )
            );
        } catch (err) {
            console.error("Error liking learning plan:", err);
            alert("Failed to like learning plan. Please try again.");
        }
    };

    const handleDelete = async (planId) => {
        if (window.confirm("Are you sure you want to delete this learning plan? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8080/learning-plans/${planId}`);
                
                // Remove the deleted plan from the UI
                setLearningPlans(prevPlans => 
                    prevPlans.filter(plan => plan.planId !== planId)
                );
                
                alert("Learning plan deleted successfully!");
            } catch (err) {
                console.error("Error deleting learning plan:", err);
                alert("Failed to delete learning plan. Please try again.");
            }
        }
    };

    const calculateProgress = (plan) => {
        if (!plan.milestones || plan.milestones.length === 0) {
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

    const renderResourceIcon = (resourceType) => {
        switch (resourceType.toLowerCase()) {
            case 'book':
                return <i className="fas fa-book resource-icon"></i>;
            case 'video':
                return <i className="fas fa-video resource-icon"></i>;
            case 'course':
                return <i className="fas fa-graduation-cap resource-icon"></i>;
            case 'article':
                return <i className="fas fa-newspaper resource-icon"></i>;
            default:
                return <i className="fas fa-link resource-icon"></i>;
        }
    };

    return (
        <div className="learning-plan-list-container">
            <div className="learning-plan-list-header">
                <h1>Learning Plans</h1>
                <p>Discover and share structured learning plans with the community</p>
                
                <div className="learning-plan-actions">
                    <Link to="/create-learning-plan" className="create-plan-btn">
                        <i className="fas fa-plus"></i> Create New Plan
                    </Link>
                </div>
                
                <div className="learning-plan-filters">
                    <div className="filter-group">
                        <label>View:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Plans</option>
                            <option value="my-plans">My Plans</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Status:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Statuses</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Abandoned">Abandoned</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading learning plans...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchLearningPlans} className="retry-btn">
                        Retry
                    </button>
                </div>
            ) : learningPlans.length === 0 ? (
                <div className="no-plans-message">
                    <i className="fas fa-book-open empty-icon"></i>
                    <h2>No learning plans found</h2>
                    {filter === "my-plans" ? (
                        <p>You haven't created any learning plans yet. Create your first plan to get started!</p>
                    ) : (
                        <p>There are no learning plans available with the selected filters.</p>
                    )}
                    <Link to="/create-learning-plan" className="create-first-plan-btn">
                        Create Your First Plan
                    </Link>
                </div>
            ) : (
                <div className="learning-plans-grid">
                    {learningPlans.map(plan => (
                        <div key={plan.planId} className="learning-plan-card">
                            <div className="plan-header">
                                <h2 className="plan-title">{plan.title}</h2>
                                <div className="plan-status-badge" data-status={plan.status.toLowerCase().replace(/\s+/g, '-')}>
                                    {plan.status}
                                </div>
                            </div>
                            
                            <p className="plan-description">{plan.description}</p>
                            
                            <div className="plan-progress">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${calculateProgress(plan)}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{calculateProgress(plan)}% Complete</span>
                            </div>
                            
                            {plan.topics && plan.topics.length > 0 && (
                                <div className="plan-topics">
                                    {plan.topics.slice(0, 3).map((topic, index) => (
                                        <span key={index} className="topic-tag">{topic}</span>
                                    ))}
                                    {plan.topics.length > 3 && (
                                        <span className="more-topics">+{plan.topics.length - 3} more</span>
                                    )}
                                </div>
                            )}
                            
                            <div className="plan-resources-preview">
                                <h3>Resources ({plan.resources ? plan.resources.length : 0})</h3>
                                <div className="resource-icons">
                                    {plan.resources && plan.resources.slice(0, 4).map((resource, index) => (
                                        <div key={index} className="resource-icon-wrapper" title={resource.resourceName}>
                                            {renderResourceIcon(resource.resourceType)}
                                        </div>
                                    ))}
                                    {plan.resources && plan.resources.length > 4 && (
                                        <div className="resource-icon-wrapper more-resources">
                                            +{plan.resources.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="plan-meta">
                                <div className="plan-creator">
                                    <i className="fas fa-user"></i>
                                    <span>{plan.username || "Anonymous"}</span>
                                </div>
                                
                                {plan.targetCompletionDate && (
                                    <div className="plan-target-date">
                                        <i className="fas fa-calendar-alt"></i>
                                        <span>Target: {formatDate(plan.targetCompletionDate)}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="plan-actions">
                                <Link to={`/learning-plans/${plan.planId}`} className="view-plan-btn">
                                    View Details
                                </Link>
                                
                                <div className="plan-interactions">
                                    <button 
                                        className="like-btn" 
                                        onClick={() => handleLike(plan.planId)}
                                        title="Like this plan"
                                    >
                                        <i className="fas fa-heart"></i>
                                        <span>{plan.likes}</span>
                                    </button>
                                    
                                    {userId === plan.userId && (
                                        <>
                                            <Link 
                                                to={`/edit-learning-plan/${plan.planId}`} 
                                                className="edit-btn"
                                                title="Edit this plan"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(plan.planId)}
                                                title="Delete this plan"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            
        </div>
    );
}

export default LearningPlanList;
