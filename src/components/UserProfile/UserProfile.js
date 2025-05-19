import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Followers from "./Followers";
import Following from "./Following";
import "./UserProfile.css";

function UserProfile() {
    const navigate = useNavigate();
    const { userId: profileUserId } = useParams(); // Get userId from URL if available
    
    const [user, setUser] = useState({
        id: "",
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        bio: "",
        profileImageUrl: "",
        followerCount: 0,
        followingCount: 0,
        postCount: 0
    });
    
    const [currentUserId, setCurrentUserId] = useState("");
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [activeTab, setActiveTab] = useState("posts"); // posts, followers, following
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const loggedInUserId = localStorage.getItem('userId');
        if (!loggedInUserId) {
            alert("Please login to view profiles");
            navigate("/login");
            return;
        }
        
        setCurrentUserId(loggedInUserId);
        
        // Determine if we're viewing our own profile or someone else's
        const targetUserId = profileUserId || loggedInUserId;
        setIsCurrentUser(loggedInUserId === targetUserId);
        
        // Fetch user data
        fetchUserData(targetUserId);
        fetchUserPosts(targetUserId);
        
        // If viewing someone else's profile, check if we're following them
        if (loggedInUserId !== targetUserId) {
            checkFollowStatus(loggedInUserId, targetUserId);
        }
    }, [navigate, profileUserId]);
    
    const fetchUserData = async (userId) => {
        try {
            setLoading(true);
            
            // If viewing own profile, get full details
            if (isCurrentUser) {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUser({
                    ...response.data,
                    password: "",
                    confirmPassword: ""
                });
            } else {
                // If viewing someone else's profile, get public profile
                const response = await axios.get(`http://localhost:8080/user/${userId}/profile`);
                setUser({
                    ...user,
                    ...response.data
                });
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user profile. Please try again.");
            setLoading(false);
        }
    };
    
    const fetchUserPosts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/user/${userId}/posts`);
            setUserPosts(response.data);
        } catch (err) {
            console.error("Error fetching user posts:", err);
        }
    };
    
    const fetchFollowers = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${userId}/followers`);
            setFollowers(response.data);
        } catch (err) {
            console.error("Error fetching followers:", err);
        }
    };
    
    const fetchFollowing = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${userId}/following`);
            setFollowing(response.data);
        } catch (err) {
            console.error("Error fetching following:", err);
        }
    };
    
    const checkFollowStatus = async (currentUserId, targetUserId) => {
        try {
            const response = await axios.get(`http://localhost:8080/users/${currentUserId}/isFollowing/${targetUserId}`);
            setIsFollowing(response.data.isFollowing);
        } catch (err) {
            console.error("Error checking follow status:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };
    
    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };
    
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        if (tab === "followers" && followers.length === 0) {
            fetchFollowers(user.id);
        } else if (tab === "following" && following.length === 0) {
            fetchFollowing(user.id);
        }
    };
    
    const handleFollow = async () => {
        try {
            await axios.post(`http://localhost:8080/users/${currentUserId}/follow/${user.id}`);
            setIsFollowing(true);
            // Refresh user data to update follower count
            fetchUserData(user.id);
        } catch (err) {
            console.error("Error following user:", err);
            alert("Failed to follow user. Please try again.");
        }
    };
    
    const handleUnfollow = async () => {
        try {
            await axios.delete(`http://localhost:8080/users/${currentUserId}/unfollow/${user.id}`);
            setIsFollowing(false);
            // Refresh user data to update follower count
            fetchUserData(user.id);
        } catch (err) {
            console.error("Error unfollowing user:", err);
            alert("Failed to unfollow user. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match if changing password
        if (user.password && user.password !== user.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            // Create a copy of user data without confirmPassword
            const userData = { ...user };
            delete userData.confirmPassword;
            
            // Only send password if it's not empty
            if (!userData.password) {
                delete userData.password;
            }

            const response = await axios.put(`http://localhost:8080/user/${user.id}`, userData);
            
            setUser({
                ...response.data,
                password: "",
                confirmPassword: ""
            });
            
            // Upload profile image if selected
            if (profileImage) {
                await uploadProfileImage();
            }
            
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile. Please try again.");
        }
    };
    
    const uploadProfileImage = async () => {
        try {
            const formData = new FormData();
            formData.append('image', profileImage);
            
            console.log('Uploading profile image for user:', user.id);
            console.log('Form data:', formData);
            
            const response = await axios.post(
                `http://localhost:8080/user/${user.id}/upload-profile-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            console.log('Profile image upload response:', response.data);
            
            // Update user with new profile image URL
            setUser({
                ...user,
                profileImageUrl: response.data.profileImageUrl
            });
            
            setProfileImage(null);
            
            // Force reload to ensure image is updated in the UI
            window.location.reload();
        } catch (err) {
            console.error("Error uploading profile image:", err);
            alert("Failed to upload profile image. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        alert("Logged out successfully!");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-card">
                    <div className="loading-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate("/")} className="save-btn">Go Home</button>
                </div>
            </div>
        );
    }

    const renderProfileHeader = () => {
        return (
            <div className="profile-header">
                <div className="profile-image-container">
                    <div className="profile-image-placeholder">
                        {user.fullname ? user.fullname.charAt(0).toUpperCase() : '?'}
                    </div>
                </div>
                
                <div className="profile-info">
                    <h2 className="profile-name">{user.fullname}</h2>
                    
                    {user.bio && <p className="profile-bio">{user.bio}</p>}
                    
                    <div className="profile-stats">
                        <div className="stat" onClick={() => handleTabChange("posts")}>
                            <span className="stat-value">{user.postCount || 0}</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat" onClick={() => handleTabChange("followers")}>
                            <span className="stat-value">{user.followerCount || 0}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat" onClick={() => handleTabChange("following")}>
                            <span className="stat-value">{user.followingCount || 0}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                    
                    <div className="profile-actions">
                        {isCurrentUser ? (
                            <>
                                <button 
                                    onClick={toggleEdit} 
                                    className={isEditing ? "cancel-btn" : "edit-btn"}
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </>
                        ) : (
                            <button 
                                onClick={isFollowing ? handleUnfollow : handleFollow}
                                className={isFollowing ? "unfollow-btn" : "follow-btn"}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
    const renderTabs = () => {
        return (
            <div className="profile-tabs">
                <div 
                    className={`tab ${activeTab === "posts" ? "active" : ""}`}
                    onClick={() => handleTabChange("posts")}
                >
                    Posts
                </div>
                <div 
                    className={`tab ${activeTab === "followers" ? "active" : ""}`}
                    onClick={() => handleTabChange("followers")}
                >
                    Followers
                </div>
                <div 
                    className={`tab ${activeTab === "following" ? "active" : ""}`}
                    onClick={() => handleTabChange("following")}
                >
                    Following
                </div>
            </div>
        );
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case "posts":
                return renderPosts();
            case "followers":
                return renderFollowers();
            case "following":
                return renderFollowing();
            default:
                return renderPosts();
        }
    };
    
    const renderPosts = () => {
        if (userPosts.length === 0) {
            return (
                <div className="no-content-message">
                    <p>No posts yet</p>
                </div>
            );
        }
        
        return (
            <div className="posts-grid">
                {userPosts.map(post => (
                    <div key={post.postId} className="post-item" onClick={() => navigate(`/view-post/${post.postId}`)}>
                        {post.imageUrl ? (
                            <img 
                                src={`http://localhost:8080/uploads/posts/${post.imageUrl}`} 
                                alt={post.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                }}
                            />
                        ) : (
                            <div className="post-no-image">
                                <h3>{post.title}</h3>
                                <p>{post.content.substring(0, 100)}...</p>
                            </div>
                        )}
                        <div className="post-overlay">
                            <div className="post-stats">
                                <span>❤️ {post.likes || 0}</span>
                                <span>💬 {post.commentCount || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    const renderFollowers = () => {
        return <Followers userId={user.id} isCurrentUser={isCurrentUser} />;
    };
    
    const renderFollowing = () => {
        return <Following userId={user.id} isCurrentUser={isCurrentUser} />;
    };
    
    const renderEditForm = () => {
        return (
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="profileImage">Profile Picture:</label>
                    <div className="profile-image-upload">
                        <div className="profile-image-placeholder edit-placeholder">
                            {user.fullname ? user.fullname.charAt(0).toUpperCase() : '?'}
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={user.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={user.bio || ''}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows="4"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* Password fields removed as requested */}
                
                <div className="form-actions">
                    <button type="button" onClick={toggleEdit} className="cancel-btn">Cancel</button>
                    <button type="submit" className="save-btn">Save Changes</button>
                </div>
            </form>
        );
    };
    
    return (
        <div className="profile-container">
            <div className="profile-card">
                
                {renderProfileHeader()}
                
                {isEditing ? (
                    renderEditForm()
                ) : (
                    <>
                        {renderTabs()}
                        {renderTabContent()}
                    </>
                )}
            </div>
        </div>
    );
}

export default UserProfile;