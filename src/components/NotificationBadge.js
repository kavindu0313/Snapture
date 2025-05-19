import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NotificationBadge.css';

function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      // Set up polling to check for new notifications
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      // Use real API endpoint to get unread notification count
      const response = await axios.get(`http://localhost:8080/notifications/${userId}/unread/count`);
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Fallback to 0 if there's an error
      setUnreadCount(0);
    }
  };

  return (
    <Link to="/notifications" className="notification-badge-container">
      <i className="fas fa-bell"></i>
      {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
    </Link>
  );
}

export default NotificationBadge;
