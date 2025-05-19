import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./EditPost.css";

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Check if user is logged in
        const currentUserId = localStorage.getItem("userId");
        if (!currentUserId) {
            navigate("/login");
            return;
        }
        
        setUserId(currentUserId);
        
        // Load post details
        loadPost();
    }, [postId, navigate]);

    const loadPost = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/posts/post/${postId}`);
            const post = response.data;
            
            // Check if the current user is the owner of this post
            if (post.userId !== userId && userId !== "") {
                setError("You don't have permission to edit this post");
                return;
            }
            
            setTitle(post.title);
            setContent(post.content);
            
            if (post.imageUrl) {
                setOriginalImageUrl(post.imageUrl);
                setImagePreview(`http://localhost:8080/uploads/posts/${post.imageUrl}`);
            }
        } catch (err) {
            console.error("Error loading post:", err);
            setError("Failed to load post. It may have been deleted or doesn't exist.");
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!title.trim()) {
            errors.title = "Title is required";
        }
        
        if (!content.trim()) {
            errors.content = "Content is required";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSaving(true);
        
        try {
            const formData = new FormData();
            
            // Create a post object
            const postData = {
                title,
                content,
                imageUrl: originalImageUrl // Keep the original image if no new one is uploaded
            };
            
            // Add the post data as JSON
            formData.append("postDetails", JSON.stringify(postData));
            
            // Add the file if a new one is selected
            if (file) {
                formData.append("file", file);
            }
            
            // Send the update request
            await axios.put(`http://localhost:8080/posts/${postId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            alert("Post updated successfully!");
            navigate(`/view-post/${postId}`);
        } catch (err) {
            console.error("Error updating post:", err);
            setError("Failed to update post. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
            setFile(selectedFile);
            
            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(selectedFile);
            setImagePreview(previewUrl);
        }
    };

    if (isLoading) {
        return (
            <div className="edit-post-container">
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>Loading post...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-post-container">
                <div className="error-container">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={loadPost} className="retry-btn">Try Again</button>
                        <Link to="/posts" className="back-btn">Back to Posts</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-post-container">
            <div className="edit-post-card">
                <h1>Edit Post</h1>
                
                <form className="edit-post-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={formErrors.title ? "input-error" : ""}
                        />
                        {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={formErrors.content ? "input-error" : ""}
                        />
                        {formErrors.content && <span className="error-message">{formErrors.content}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="image">Image (Optional)</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="file-hint">Leave empty to keep the current image</p>
                    </div>
                    
                    {imagePreview && (
                        <div className="image-preview">
                            <h3>Image Preview</h3>
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="preview-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                                }}
                            />
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSaving}
                    >
                        {isSaving ? "Updating..." : "Update Post"}
                    </button>
                </form>
                
                <div className="navigation-links">
                    <Link to={`/view-post/${postId}`} className="nav-link">Cancel</Link>
                    <Link to="/posts" className="nav-link">Back to Posts</Link>
                </div>
            </div>
        </div>
    );
}

export default EditPost;
