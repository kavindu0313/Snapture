import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';
import './Header.css';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      
      <div className="header-search">
        <form onSubmit={handleSearch}>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search for photos, photographers, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search photos"
            />
            <button type="submit" className="search-button" aria-label="Submit search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
      
      <div className="header-actions">
        <NotificationBadge />
        
        <Link to="/messages" className="header-icon-button">
          <i className="fas fa-envelope"></i>
        </Link>
        
        <Link to="/profile" className="header-profile-button">
          <div className="header-profile-avatar">
            <i className="fas fa-user"></i>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
