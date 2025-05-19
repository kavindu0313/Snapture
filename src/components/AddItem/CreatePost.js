import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./CreatePost.css";

function CreatePost() {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        postId: "",
        title: "",
        content: "",
        imageUrl: null,
        userId: "",
        username: ""
    });
    const [postImage, setPostImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("userFullName");
        
        if (!userId) {
            alert("Please login to create a post");
            navigate("/login");
            return;
        }
        
        // Set user info in post
        setPost(prev => ({
            ...prev,
            userId: userId,
            username: userName || "Anonymous"
        }));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
        
        // Mark field as touched
        setTouched({ ...touched, [name]: true });
        
        // Validate on change
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPostImage(e.target.files[0]);
            validateField("imageUrl", e.target.files[0]);
        }
    };

    // Handle blur event for validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, value);
    };

    // Validate a single field
    const validateField = (name, value) => {
        let newErrors = { ...errors };
        
        switch (name) {
            case 'title':
                if (!value) {
                    newErrors.title = 'Title is required';
                } else if (typeof value === 'string' && value.trim() === "") {
                    newErrors.title = 'Title is required';
                } else if (typeof value === 'string' && value.length < 3) {
                    newErrors.title = 'Title must be at least 3 characters';
                } else {
                    delete newErrors.title;
                }
                break;
                
            case 'content':
                if (!value) {
                    newErrors.content = 'Content is required';
                } else if (typeof value === 'string' && value.trim() === "") {
                    newErrors.content = 'Content is required';
                } else if (typeof value === 'string' && value.length < 10) {
                    newErrors.content = 'Content must be at least 10 characters';
                } else {
                    delete newErrors.content;
                }
                break;
                
            case 'imageUrl':
                if (value) {
                    // Check file type
                    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
                    if (!acceptedTypes.includes(value.type)) {
                        newErrors.imageUrl = 'Only JPG, PNG, and GIF images are allowed';
                    } else if (value.size > 5 * 1024 * 1024) { // 5MB limit
                        newErrors.imageUrl = 'Image size should be less than 5MB';
                    } else {
                        delete newErrors.imageUrl;
                    }
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
    };

    // Validate all fields
    const validateForm = () => {
        validateField('title', post.title);
        validateField('content', post.content);
        if (postImage) {
            validateField('imageUrl', postImage);
        }
        
        // Mark all fields as touched
        setTouched({
            title: true,
            content: true,
            imageUrl: true
        });
        
        // Return true if no errors
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            alert("Please fix the errors in the form before submitting.");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            let imageFileName = "";
            
            // Upload image if provided
            if (postImage) {
                const formData = new FormData();
                formData.append("file", postImage);
                
                try {
                    const response = await axios.post(
                        "http://localhost:8080/posts/upload",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    imageFileName = response.data;
                } catch (error) {
                    console.error("Error uploading image:", error);
                    alert("Error uploading image. Please try again.");
                    setIsSubmitting(false);
                    return;
                }
            }
            
            // Create post with image URL
            const postData = {
                ...post,
                imageUrl: imageFileName,
                postId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            };
            
            await axios.post("http://localhost:8080/posts", postData);
            alert("Post created successfully!");
            navigate("/posts"); // Navigate to posts page
            
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Error creating post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-post-container">
            <div className="create-post-card">
                <h1>Create New Post</h1>
                
                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.title && errors.title ? 'input-error' : ''}
                            placeholder="Enter post title"
                        />
                        {touched.title && errors.title && <span className="error-message">{errors.title}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.content && errors.content ? 'input-error' : ''}
                            placeholder="Write your post content here..."
                            rows="6"
                        ></textarea>
                        {touched.content && errors.content && <span className="error-message">{errors.content}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="postImage">Upload Image (Optional)</label>
                        <input
                            type="file"
                            id="postImage"
                            name="postImage"
                            onChange={handleImageChange}
                            accept="image/*"
                            className={touched.imageUrl && errors.imageUrl ? 'input-error' : ''}
                        />
                        {touched.imageUrl && errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
                        
                        {postImage && (
                            <div className="image-preview">
                                <img 
                                    src={URL.createObjectURL(postImage)} 
                                    alt="Preview" 
                                    className="preview-image"
                                />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Post..." : "Create Post"}
                    </button>
                </form>
                
                <div className="navigation-links">
                    <Link to="/posts" className="nav-link">View All Posts</Link>
                    <Link to="/home" className="nav-link">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
