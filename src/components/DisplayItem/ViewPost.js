import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "../Comment/CommentSection";
import "./ViewPost.css";

function ViewPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
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
        
        // Load post details
        loadPost();
    }, [postId]);

    const loadPost = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/posts/post/${postId}`);
            setPost(response.data);
        } catch (err) {
            console.error("Error loading post:", err);
            setError("Failed to load post. It may have been deleted or doesn't exist.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            // Get current user info
            const currentUserId = localStorage.getItem("userId");
            const username = localStorage.getItem("userFullName") || "User";
            
            if (!currentUserId) {
                alert("Please log in to like posts");
                navigate("/login");
                return;
            }
            
            // Send user info with the like request for notifications
            const response = await axios.post(`http://localhost:8080/posts/${postId}/like`, null, {
                params: {
                    likerId: currentUserId,
                    likerUsername: username
                }
            });
            
            setPost(response.data);
        } catch (err) {
            console.error("Error liking post:", err);
            alert("Failed to like post. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`http://localhost:8080/posts/${postId}`);
                alert("Post deleted successfully!");
                navigate("/posts");
            } catch (err) {
                console.error("Error deleting post:", err);
                alert("Failed to delete post. Please try again.");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (isLoading) {
        return (
            <div className="view-post-container">
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="view-post-container">
                <div className="error-container">
                    <h2>Oops!</h2>
                    <p>{error || "Post not found"}</p>
                    <div className="error-actions">
                        <button onClick={loadPost} className="retry-btn">Try Again</button>
                        <Link to="/posts" className="back-btn">Back to Posts</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view-post-container">
            <div className="view-post-card">
                <div className="post-header">
                    <h1>{post.title}</h1>
                    <div className="post-meta">
                        <span className="post-author">Posted by {post.username}</span>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                    </div>
                </div>
                
                {post.imageUrl && (
                    <div className="post-image">
                        <img 
                            src={`http://localhost:8080/uploads/posts/${post.imageUrl}`} 
                            alt={post.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                            }}
                        />
                    </div>
                )}
                
                <div className="post-content">
                    <p>{post.content}</p>
                </div>
                 <div className="post-meta">
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                    </div>
                
                <div className="post-actions">
                    <button 
                        className="like-btn"
                        onClick={handleLike}
                    >
                        <span className="like-icon">❤️</span> {post.likes || 0} Likes
                    </button>
                    
                    {userId === post.userId && (
                        <div className="owner-actions">
                            <Link 
                                to={`/edit-post/${post.postId}`}
                                className="edit-btn"
                            >
                                Edit Post
                            </Link>
                            
                            <button 
                                className="delete-btn"
                                onClick={handleDelete}
                            >
                                Delete Post
                            </button>
                        </div>
                    )}
                </div>
                
                
                {/* Comment Section */}
                <CommentSection postId={post.postId} postOwnerId={post.userId} />
            </div>
        </div>
    );
}

export default ViewPost;
