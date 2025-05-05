import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message';
  sender: {
    id: string;
    username: string;
    profilePicture: string;
  };
  content: string;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'profile';
  createdAt: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const socketRef = useRef<any>(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true
  });
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  // Mock data for notifications
  useEffect(() => {
    // In a real app, this would be an API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        sender: {
          id: '101',
          username: 'alex_photo',
          profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        content: 'liked your photo',
        targetId: 'post123',
        targetType: 'post',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'comment',
        sender: {
          id: '102',
          username: 'maria_captures',
          profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        content: 'commented: "Beautiful shot!"',
        targetId: 'post456',
        targetType: 'post',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        read: false
      },
      {
        id: '3',
        type: 'follow',
        sender: {
          id: '103',
          username: 'photo_master',
          profilePicture: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        content: 'started following you',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        read: true
      },
      {
        id: '4',
        type: 'mention',
        sender: {
          id: '104',
          username: 'capture_pro',
          profilePicture: 'https://randomuser.me/api/portraits/women/28.jpg'
        },
        content: 'mentioned you in a comment: "Check out @username\'s work"',
        targetId: 'comment789',
        targetType: 'comment',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        read: true
      },
      {
        id: '5',
        type: 'message',
        sender: {
          id: '105',
          username: 'lens_expert',
          profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        content: 'sent you a message',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);

    // Setup WebSocket connection
    // In a real app, this would connect to a real socket server
    // socketRef.current = io('http://localhost:8080');
    
    // Mock new notification every 15 seconds
    const interval = setInterval(() => {
      const randomTypes = ['like', 'comment', 'follow', 'mention', 'message'];
      const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)] as 'like' | 'comment' | 'follow' | 'mention' | 'message';
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: randomType,
        sender: {
          id: '10' + Math.floor(Math.random() * 9 + 1),
          username: 'user_' + Math.floor(Math.random() * 1000),
          profilePicture: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50 + 1)}.jpg`
        },
        content: getContentByType(randomType),
        ...(randomType !== 'follow' && {
          targetId: 'target' + Math.floor(Math.random() * 1000),
          targetType: Math.random() > 0.3 ? 'post' : 'comment'
        }),
        createdAt: new Date().toISOString(),
        read: false
      };
      
      // Check if notification type is enabled in preferences
      const notificationType = randomType === 'like' ? 'likes' : 
                              randomType === 'comment' ? 'comments' :
                              randomType === 'follow' ? 'follows' :
                              randomType === 'mention' ? 'mentions' : 'messages';
                              
      if (notificationPreferences[notificationType as keyof typeof notificationPreferences]) {
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show browser notification if supported
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`New ${randomType} notification`, {
            body: `${newNotification.sender.username} ${newNotification.content}`,
            icon: newNotification.sender.profilePicture
          });
        }
      }
    }, 15000);
    
    return () => {
      clearInterval(interval);
      // socketRef.current?.disconnect();
    };
  }, [notificationPreferences]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  const getContentByType = (type: string): string => {
    switch(type) {
      case 'like':
        return 'liked your photo';
      case 'comment':
        return 'commented: "' + getRandomComment() + '"';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a comment';
      case 'message':
        return 'sent you a message';
      default:
        return '';
    }
  };

  const getRandomComment = (): string => {
    const comments = [
      'Great shot!',
      'Amazing composition!',
      'Love the colors!',
      'What camera did you use?',
      'This is incredible!',
      'Perfect lighting!'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'like':
        return (
          <div className="p-2 rounded-full bg-red-100 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="p-2 rounded-full bg-blue-100 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="p-2 rounded-full bg-green-100 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="p-2 rounded-full bg-purple-100 text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="p-2 rounded-full bg-yellow-100 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  const getNotificationLink = (notification: Notification): string => {
    switch(notification.type) {
      case 'like':
      case 'comment':
      case 'mention':
        return notification.targetType === 'post' 
          ? `/post/${notification.targetId}` 
          : `/comment/${notification.targetId}`;
      case 'follow':
        return `/profile/${notification.sender.username}`;
      case 'message':
        return `/messages`;
      default:
        return '#';
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : activeFilter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeFilter);

  const handleTogglePreference = (type: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'text-dark-text' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-2">
          <button 
            onClick={markAllAsRead}
            className={`px-3 py-1 text-sm rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Mark all as read
          </button>
          <button 
            onClick={() => setShowPreferences(!showPreferences)}
            className={`px-3 py-1 text-sm rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      {showPreferences && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-dark-secondary' : 'bg-white'} shadow`}>
          <h2 className="text-lg font-medium mb-3">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pref-likes"
                checked={notificationPreferences.likes}
                onChange={() => handleTogglePreference('likes')}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="pref-likes">Likes</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pref-comments"
                checked={notificationPreferences.comments}
                onChange={() => handleTogglePreference('comments')}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="pref-comments">Comments</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pref-follows"
                checked={notificationPreferences.follows}
                onChange={() => handleTogglePreference('follows')}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="pref-follows">Follows</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pref-mentions"
                checked={notificationPreferences.mentions}
                onChange={() => handleTogglePreference('mentions')}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="pref-mentions">Mentions</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pref-messages"
                checked={notificationPreferences.messages}
                onChange={() => handleTogglePreference('messages')}
                className="h-4 w-4 mr-2"
              />
              <label htmlFor="pref-messages">Messages</label>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'all' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'unread' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'like' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('like')}
        >
          Likes
        </button>
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'comment' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('comment')}
        >
          Comments
        </button>
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'follow' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('follow')}
        >
          Follows
        </button>
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'mention' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('mention')}
        >
          Mentions
        </button>
        <button 
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            activeFilter === 'message' 
              ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
          }`}
          onClick={() => setActiveFilter('message')}
        >
          Messages
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You're all caught up!
          </p>
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          {filteredNotifications.map((notification) => (
            <Link 
              key={notification.id} 
              to={getNotificationLink(notification)}
              className={`block border-b last:border-b-0 ${
                darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
              } ${!notification.read ? (darkMode ? 'bg-gray-800' : 'bg-blue-50') : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center p-4">
                <div className="flex-shrink-0 mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start">
                    <img 
                      src={notification.sender.profilePicture} 
                      alt={notification.sender.username} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p>
                        <span className="font-medium">{notification.sender.username}</span>{' '}
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {notification.content}
                        </span>
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <div className="ml-2 flex-shrink-0">
                    <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
