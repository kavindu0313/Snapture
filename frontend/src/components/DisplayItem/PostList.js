import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostList.css";

function PostList() {
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
        
        // Load all posts
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/posts");
            setPosts(response.data);
        } catch (err) {
            console.error("Error loading posts:", err);
            setError("Failed to load posts. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (postId) => {
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
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`http://localhost:8080/posts/${postId}`);
                // Remove the deleted post from state
                setPosts(posts.filter(post => post.postId !== postId));
                alert("Post deleted successfully!");
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
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (isLoading) {
        return (
            <div className="posts-container">
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="posts-container">
                <div className="error-container">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <button onClick={loadPosts} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="posts-container">
            <div className="posts-header">
                <h1>Snapture Posts</h1>
                <Link to="/create-post" className="create-post-btn">+ Create New Post</Link>
            </div>
            
            {posts.length === 0 ? (
                <div className="no-posts">
                    <h2>No posts yet</h2>
                    <p>Be the first to share a post!</p>
                    <Link to="/create-post" className="create-post-link">Create Post</Link>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <div key={post.postId} className="post-card">
                            <div className="post-header">
                                <p className="post-author">Posted by {post.username}</p>
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
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-date">{formatDate(post.createdAt)}</p>
                            </div>
                            
                            
                            <div className="post-content">
                                <p>{post.content}</p>
                            </div>
                            
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
                                    View Details
                                </Link>
                                
                               
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            
        </div>
    );
}

export default PostList;
