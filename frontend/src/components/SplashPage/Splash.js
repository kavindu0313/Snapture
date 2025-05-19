import React from "react";
import { Link } from "react-router-dom";
import "./Splash.css";

function Splash() {
  return (
    <div className="splash-container">
      <div className="splash-content animate-fade">
        <div className="splash-logo bounce-in">
          <h1>Snapture</h1>
          <p className="tagline">Capture. Organize. Inspire.</p>
        </div>

        <div className="splash-description fade-in-up">
          <p>
            Welcome to <strong>Snapture</strong> the ultimate hub for unleashing your creativity, managing your photo world, and inspiring a global community.

          </p>
        </div>

        <div className="splash-buttons fade-in-up">
          <Link to="/login" className="splash-button login-btn">
            Login
          </Link>
          <Link to="/register" className="splash-button register-btn">
            Sign Up
          </Link>
        </div>

        <div className="splash-features">
          <div className="feature slide-up">
            <h3>Easy Upload</h3>
            <p>Drag, drop, and organize photos in seconds.</p>
          </div>
          <div className="feature slide-up">
            <h3>Smart Organization</h3>
            <p>Auto-categorize by tags, albums, and dates.</p>
          </div>
          <div className="feature slide-up">
            <h3>User Profiles</h3>
            <p>Customize your experience and settings.</p>
          </div>
          <div className="feature slide-up">
            <h3>Community Posts</h3>
            <p>Share your masterpieces and get inspired.</p>
          </div>
        </div>
      </div>

      <footer className="splash-footer">
        <p>&copy; 2025 Snapture. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Splash;
