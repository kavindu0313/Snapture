import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserSuggestions from "../UserProfile/UserSuggestions";
import Stories from "../Stories";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    const userFullName = localStorage.getItem("userFullName");
    
    // Enhanced check to ensure userId exists and is valid
    if (!userId || userId === "undefined" || userId === "null") {
      // Clear any potentially corrupted localStorage data
      localStorage.removeItem("userId");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userEmail");
      
      console.log("Home: User not authenticated, redirecting to login");
      // Redirect to login page if not logged in
      navigate("/login");
    } else if (userFullName) {
      setUserName(userFullName);
    }
    
    // No inventory loading needed
  }, [navigate]);
  

  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
    
    // Redirect to splash page
    navigate("/");
  };
  

  
  return (
    <div className="home-container">
      <main className="home-content">
        <div className="trending-topics-section">
          <h3 className="trending-title">Trending Topics</h3>
          <div className="trending-topics">
            <Link to="/explore?topic=portrait" className="topic-chip">#PortraitPhotography</Link>
            <Link to="/explore?topic=landscape" className="topic-chip">#LandscapeShots</Link>
            <Link to="/explore?topic=street" className="topic-chip">#StreetPhotography</Link>
            <Link to="/explore?topic=travel" className="topic-chip">#TravelDiaries</Link>
            <Link to="/explore?topic=architecture" className="topic-chip">#ArchitecturalBeauty</Link>
          </div>
        </div>
      
        <div className="home-layout">
          <div className="main-content">
            <div className="featured-posts-section">
              <h2>Featured Posts</h2>
              <p className="section-intro">Share your photography journey with the Snapture community.</p>
              <div className="featured-posts-actions">
                <Link to="/posts" className="view-all-btn">View All Posts</Link>
                <Link to="/create-post" className="create-btn">Create New Post</Link>
              </div>
            </div>
            
            <div className="featured-posts-section learning-section">
              <h2>Learning Progress</h2>
              <p className="section-intro">Share your learning journey and track your progress with the community.</p>
              <div className="featured-posts-actions">
                <Link to="/posts/learning-progress" className="view-all-btn">View Learning Updates</Link>
                <Link to="/learning-progress/create" className="create-btn">Share Progress</Link>
              </div>
            </div>
            
            <div className="featured-posts-section learning-plans-section">
              <h2>Learning Plans</h2>
              <p className="section-intro">Create and share structured learning plans with milestones and resources.</p>
              <div className="featured-posts-actions">
                <Link to="/learning-plans" className="view-all-btn">View Learning Plans</Link>
                <Link to="/create-learning-plan" className="create-btn">Create Learning Plan</Link>
              </div>
            </div>
          </div>
          
          <div className="sidebar">
            <UserSuggestions limit={5} />
            <div className="sidebar-section">
              <h3>Quick Access</h3>
              <div className="quick-access-buttons">
                <Link to="/stories" className="quick-access-btn">
                  <i className="fa fa-camera"></i>
                  Add Story
                </Link>
                <Link to="/messages" className="quick-access-btn">
                  <i className="fa fa-envelope"></i>
                  Messages
                </Link>
                <Link to="/communities" className="quick-access-btn">
                  <i className="fa fa-plus-circle"></i>
                  Communities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="home-footer">
        <p>&copy; 2025 Snapture. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;