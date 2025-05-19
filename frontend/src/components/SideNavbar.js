import React from "react";
import { Link, useLocation } from "react-router-dom";

function SideNavbar() {
  const location = useLocation();
  
  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="side-navbar">
      <div className="side-navbar-logo">
        <Link to="/home" className="logo-link">
          Snapture
        </Link>
      </div>
      
      <nav className="side-navbar-links">
        <Link to="/home" className={`side-navbar-button ${isActive('/home') ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/posts" className={`side-navbar-button ${isActive('/posts') ? 'active' : ''}`}>
          Feed
        </Link>
        
        <Link to="/explore" className={`side-navbar-button ${isActive('/explore') ? 'active' : ''}`}>
          Explore
        </Link>
        
        <Link to="/stories" className={`side-navbar-button ${isActive('/stories') ? 'active' : ''}`}>
          Stories
        </Link>
      
        
        <Link to="/learning-plans" className={`side-navbar-button ${isActive('/learning-plans') ? 'active' : ''}`}>
           Plans
        </Link>
        <Link to="/posts/learning-progress" className={`side-navbar-button ${isActive('/posts/learning-progress') ? 'active' : ''}`}>
          Progress
        </Link>
        
        
        <Link to="/communities" className={`side-navbar-button ${isActive('/communities') ? 'active' : ''}`}>
          Communities
        </Link>
        
      </nav>
      
      <div className="side-navbar-profile">
        
        <Link to="/settings" className={`side-navbar-button ${isActive('/settings') ? 'active' : ''}`}>
          Settings
        </Link>
      </div>
    </div>
  );
}

export default SideNavbar;
