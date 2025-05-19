import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LearningProgressList.css";

function LearningProgressList() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            setUserId(currentUserId);
        }
        
        // Load learning progress posts
        loadLearningProgressPosts();
    }, []);

    const loadLearningProgressPosts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/posts/learning-progress");
            setPosts(response.data);
        } catch (err) {
            console.error("Error loading learning progress posts:", err);
            setError("Failed to load learning progress posts. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8080/posts/${postId}/like`);
            
            // Update the post in the state
            setPosts(posts.map(post => 
                post.postId === postId ? response.data : post
            ));
        } catch (err) {
            console.error("Error liking post:", err);
            alert("Failed to like post. Please try again.");
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this learning progress update?")) {
            try {
                await axios.delete(`http://localhost:8080/posts/${postId}`);
                // Remove the deleted post from state
                setPosts(posts.filter(post => post.postId !== postId));
                alert("Learning progress update deleted successfully!");
            } catch (err) {
                console.error("Error deleting post:", err);
                alert("Failed to delete learning progress update. Please try again.");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getTemplateDisplayName = (templateId) => {
        switch (templateId) {
            case 'tutorial_completion':
                return 'Tutorial Completion';
            case 'new_skill':
                return 'New Skill Acquired';
            case 'course_milestone':
                return 'Course Milestone';
            default:
                return 'Learning Progress';
        }
    };

    const renderTemplateSpecificContent = (post) => {
        switch (post.template) {
            case 'tutorial_completion':
                return (
                    <div className="template-specific-content">
                        <div className="detail-item">
                            <span className="detail-label">Tutorial:</span>
                            <span className="detail-value">{post.tutorialName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Platform:</span>
                            <span className="detail-value">{post.platform}</span>
                        </div>
                        {post.completionDate && (
                            <div className="detail-item">
                                <span className="detail-label">Completed:</span>
                                <span className="detail-value">{post.completionDate}</span>
                            </div>
                        )}
                        {post.skillsLearned && post.skillsLearned.length > 0 && (
                            <div className="detail-item skills-list">
                                <span className="detail-label">Skills Learned:</span>
                                <div className="skills-tags">
                                    {post.skillsLearned.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'new_skill':
                return (
                    <div className="template-specific-content">
                        <div className="detail-item">
                            <span className="detail-label">Skill:</span>
                            <span className="detail-value">{post.skillName}</span>
                        </div>
                        {post.proficiencyLevel && (
                            <div className="detail-item">
                                <span className="detail-label">Proficiency:</span>
                                <span className="detail-value proficiency-level">{post.proficiencyLevel}</span>
                            </div>
                        )}
                        {post.learningResources && post.learningResources.length > 0 && (
                            <div className="detail-item resources-list">
                                <span className="detail-label">Resources:</span>
                                <div className="resource-tags">
                                    {post.learningResources.map((resource, index) => (
                                        <span key={index} className="resource-tag">{resource}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {post.practiceProjects && (
                            <div className="detail-item">
                                <span className="detail-label">Practice Projects:</span>
                                <span className="detail-value">{post.practiceProjects}</span>
                            </div>
                        )}
                    </div>
                );
            case 'course_milestone':
                return (
                    <div className="template-specific-content">
                        <div className="detail-item">
                            <span className="detail-label">Course:</span>
                            <span className="detail-value">{post.courseName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Milestone:</span>
                            <span className="detail-value milestone">{post.milestone}</span>
                        </div>
                        {post.challengesFaced && (
                            <div className="detail-item">
                                <span className="detail-label">Challenges:</span>
                                <span className="detail-value">{post.challengesFaced}</span>
                            </div>
                        )}
                        {post.nextSteps && (
                            <div className="detail-item">
                                <span className="detail-label">Next Steps:</span>
                                <span className="detail-value">{post.nextSteps}</span>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="learning-progress-list-container">
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>Loading learning progress updates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learning-progress-list-container">
                <div className="error-container">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <button onClick={loadLearningProgressPosts} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="learning-progress-list-container">
            <div className="learning-progress-header">
                <h1>Learning Progress </h1>
                <Link to="/learning-progress/create" className="create-progress-btn">+ Share Progress</Link>
            </div>
            
            {posts.length === 0 ? (
                <div className="no-posts">
                    <h2>No learning progress updates yet</h2>
                    <p>Share your learning journey with the community!</p>
                    <Link to="/learning-progress/create" className="create-progress-link">Share Progress</Link>
                </div>
            ) : (
                <div className="learning-progress-grid">
                    {posts.map(post => (
                        <div key={post.postId} className="learning-progress-card">
                            <div className="template-badge">
                                {getTemplateDisplayName(post.template)}
                            </div>
                            
                            <div className="post-header">
                               
                                <p className="post-author">Posted by {post.username}</p>
                                
                            </div>
                            
                            {post.imageUrl && (
                                <div className="post-image">
                                    <img 
                                        src={`http://localhost:8080/uploads/posts/${post.imageUrl}`} 
                                        alt={post.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="post-header">
                                <h2 className="post-title">{post.title}</h2>
                               
                            </div>
                             <div className="post-content">
                                <p><h4>{post.content}</h4></p>
                            </div>
                            <div className="post-header">
                                
                                <p className="post-date">{formatDate(post.createdAt)}</p>
                            </div>
                            
                           
                            
                            {renderTemplateSpecificContent(post)}
                            
                            <div className="post-actions">
                                <button 
                                    className="like-btn"
                                    onClick={() => handleLike(post.postId)}
                                >
                                    <span className="like-icon">❤️</span> {post.likes || 0}
                                </button>
                                
                                <Link 
                                    to={`/view-post/${post.postId}`}
                                    className="view-btn"
                                >
                                    Details
                                </Link>
                                
                                {userId === post.userId && (
                                    <>
                                    
                                        <Link 
                                            to={`/edit-post/${post.postId}`}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </Link>
                                        
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(post.postId)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    );
}

export default LearningProgressList;
