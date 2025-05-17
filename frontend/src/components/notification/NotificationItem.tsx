import React from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '../../types';
import { notificationAPI } from '../../services/api';
import TimeAgo from 'react-timeago';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const handleMarkAsRead = async () => {
    try {
      await notificationAPI.markAsRead(notification.id);
      onMarkAsRead(notification.id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  //getNotificationLink
  const getNotificationLink = () => {
    switch (notification.type) {
      case 'like':
      case 'comment':
        return `/posts/${notification.postId}`;
      case 'follow':
        return `/profile/${notification.senderUsername}`;
      case 'community':
        return `/communities/${notification.communityId}`;
      default:
        return '#';
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      case 'community':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
            <svg
              className="w-6 h-6 text-purple-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <Link
      to={getNotificationLink()}
      onClick={!notification.read ? handleMarkAsRead : undefined}
      className={`flex items-start p-4 transition-colors duration-200 ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      } hover:bg-gray-50 border-b border-gray-200`}
    >
      <div className="flex-shrink-0 mr-4">
        {notification.senderProfilePic ? (
          <img
            src={notification.senderProfilePic}
            alt={notification.senderUsername}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          getNotificationIcon()
        )}
      </div>
      
      <div className="flex-grow">
        <p className="text-sm text-gray-800">{notification.message}</p>
        <p className="mt-1 text-xs text-gray-500">
          <TimeAgo date={new Date(notification.createdAt)} />
        </p>
      </div>
      
      {!notification.read && (
        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
      )}
    </Link>
  );
};

export default NotificationItem;
