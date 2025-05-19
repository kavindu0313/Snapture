import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      
      // Mark notifications as viewed when component mounts
      const markNotificationsAsViewed = async () => {
        try {
          // Use real API endpoint to mark notifications as viewed
          await axios.put(`http://localhost:8080/notifications/${userId}/view`);
          console.log('Notifications marked as viewed');
        } catch (error) {
          console.error('Error marking notifications as viewed:', error);
        }
      };
      
      markNotificationsAsViewed();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Use real API endpoint to get notifications
      const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
      // Show empty state if there's an error
      setNotifications([]);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Use real API endpoint to mark notification as read
      await axios.put(`http://localhost:8080/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? {...notification, isRead: true} 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Use real API endpoint to mark all notifications as read
      await axios.put(`http://localhost:8080/notifications/${userId}/read-all`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({...notification, isRead: true}))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationLink = (notification) => {
    switch(notification.type) {
      case 'like':
      case 'comment':
        return `/view-post/${notification.relatedItemId}`;
      case 'follow':
        return `/profile/${notification.relatedItemId}`;
      case 'mention':
        return `/view-post/${notification.relatedItemId.split('comment')[0]}`;
      default:
        return '#';
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like':
        return <i className="fas fa-heart"></i>;
      case 'comment':
        return <i className="fas fa-comment"></i>;
      case 'follow':
        return <i className="fas fa-user-plus"></i>;
      case 'mention':
        return <i className="fas fa-at"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHour < 24) {
      return `${diffHour}h ago`;
    } else if (diffDay < 7) {
      return `${diffDay}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.isRead);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          <button 
            className="mark-all-read-btn" 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <div className="notifications-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="unread-count">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </button>
      </div>
      
      {loading ? (
        <div className="notifications-loading">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="notifications-empty">
          <div className="empty-icon">
            <i className="fas fa-bell-slash"></i>
          </div>
          <h3>No notifications</h3>
          <p>
            {activeTab === 'all' 
              ? "You don't have any notifications yet" 
              : "You don't have any unread notifications"}
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <Link 
              to={getNotificationLink(notification)}
              key={notification.notificationId}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.notificationId)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <p>{notification.content}</p>
                <span className="notification-time">
                  {formatTime(notification.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
