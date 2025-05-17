import React, { useState, useEffect } from 'react';
import { Notification } from '../../types';
import { notificationAPI } from '../../services/api';
import NotificationItem from './NotificationItem';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

//   fetch notifications
  useEffect(() => {
    
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await notificationAPI.getNotifications();
        setNotifications(response);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);


//   mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No notifications yet.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
