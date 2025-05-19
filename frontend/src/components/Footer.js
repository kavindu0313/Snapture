import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Snapture</h3>
          <p>Share your photography journey with the world.</p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-pinterest-p"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/posts">Feed</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/stories">Stories</Link></li>
            <li><Link to="/communities">Communities</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Learn</h4>
          <ul className="footer-links">
            <li><Link to="/learning-plans">Learning Plans</Link></li>
            <li><Link to="/posts/learning-progress">Progress Tracking</Link></li>
            <li><Link to="/explore?topic=tutorial">Tutorials</Link></li>
            <li><Link to="/explore?topic=tips">Photography Tips</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Snapture. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
