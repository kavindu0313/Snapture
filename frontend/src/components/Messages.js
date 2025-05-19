import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Messages.css';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load mock conversations data
    loadMockConversations();
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadMockConversations = () => {
    // Mock data for conversations
    const mockConversations = [
      {
        id: 1,
        userId: 1,
        username: 'Isuru_captures',
        userImage: '',
        lastMessage: 'Hey, I loved your recent photo!',
        timestamp: new Date(2025, 4, 17, 14, 30).toISOString(),
        unread: 2
      },
      {
        id: 2,
        userId: 2,
        username: 'Dilshan Jayasinghe',
        userImage: '',
        lastMessage: 'What camera did you use for that shot?',
        timestamp: new Date(2025, 4, 17, 13, 15).toISOString(),
        unread: 0
      },
      {
        id: 3,
        userId: 3,
        username: 'Sanduni Perera',
        userImage: '',
        lastMessage: 'Thanks for the feedback on my portfolio!',
        timestamp: new Date(2025, 4, 17, 12, 0).toISOString(),
        unread: 0
      },
      {
        id: 4,
        userId: 4,
        username: 'Justin_shots',
        userImage: '',
        lastMessage: 'Are you going to the photography meetup?',
        timestamp: new Date(2025, 4, 16, 18, 45).toISOString(),
        unread: 1
      },
      {
        id: 5,
        userId: 5,
        username: 'Nish wijesinghe',
        userImage: '',
        lastMessage: 'I just got a new lens, it\'s amazing!',
        timestamp: new Date(2025, 4, 16, 15, 30).toISOString(),
        unread: 0
      }
    ];
    
    setConversations(mockConversations);
  };

  const loadMockMessages = (conversationId) => {
    // Mock data for messages based on conversation ID
    const mockMessages = [
      {
        id: 1,
        senderId: conversationId,
        text: 'Hey there! How are you?',
        timestamp: new Date(2025, 4, 17, 10, 0).toISOString(),
        isRead: true
      },
      {
        id: 2,
        senderId: 'currentUser', // Current user's messages
        text: 'I\'m doing great! Just finished editing some photos.',
        timestamp: new Date(2025, 4, 17, 10, 5).toISOString(),
        isRead: true
      },
      {
        id: 3,
        senderId: conversationId,
        text: 'That sounds awesome! What kind of photos?',
        timestamp: new Date(2025, 4, 17, 10, 10).toISOString(),
        isRead: true
      },
      {
        id: 4,
        senderId: 'currentUser',
        text: 'Mostly landscape shots from my recent trip to the mountains.',
        timestamp: new Date(2025, 4, 17, 10, 15).toISOString(),
        isRead: true
      },
      {
        id: 5,
        senderId: conversationId,
        text: 'I\'d love to see them! Can you share some?',
        timestamp: new Date(2025, 4, 17, 10, 20).toISOString(),
        isRead: true
      },
      {
        id: 6,
        senderId: 'currentUser',
        text: 'Sure! I\'ll upload them to my profile later today.',
        timestamp: new Date(2025, 4, 17, 10, 25).toISOString(),
        isRead: true
      },
      {
        id: 7,
        senderId: conversationId,
        text: 'Great! I\'ll keep an eye out for them.',
        timestamp: new Date(2025, 4, 17, 10, 30).toISOString(),
        isRead: false
      }
    ];
    
    setMessages(mockMessages);
  };

  const openConversation = (conversation) => {
    setActiveConversation(conversation);
    loadMockMessages(conversation.id);
    
    // Mark conversation as read
    const updatedConversations = conversations.map(c => {
      if (c.id === conversation.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    setConversations(updatedConversations);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add new message to the list
    const newMessageObj = {
      id: messages.length + 1,
      senderId: 'currentUser',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setMessages([...messages, newMessageObj]);
    
    // Update last message in conversation list
    const updatedConversations = conversations.map(c => {
      if (c.id === activeConversation.id) {
        return { 
          ...c, 
          lastMessage: newMessage,
          timestamp: new Date().toISOString()
        };
      }
      return c;
    });
    
    // Sort conversations by latest message
    const sortedConversations = [...updatedConversations].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    setConversations(sortedConversations);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week, show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older, show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conversation => 
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-header">
          <h2>Messages</h2>
          <button className="new-message-btn">
            <i className="fa fa-edit"></i>
          </button>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="conversations-list">
          {filteredConversations.map(conversation => (
            <div 
              key={conversation.id} 
              className={`conversation-item ${activeConversation?.id === conversation.id ? 'active' : ''}`}
              onClick={() => openConversation(conversation)}
            >
              <div className="conversation-avatar">
                {conversation.userImage ? (
                  <img src={conversation.userImage} alt={conversation.username} />
                ) : (
                  <div className="avatar-placeholder">
                    <span>{conversation.username.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                {conversation.unread > 0 && (
                  <span className="unread-badge">{conversation.unread}</span>
                )}
              </div>
              
              <div className="conversation-info">
                <div className="conversation-header">
                  <span className="conversation-name">{conversation.username}</span>
                  <span className="conversation-time">{formatTimestamp(conversation.timestamp)}</span>
                </div>
                <p className="conversation-preview">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="messages-content">
        {activeConversation ? (
          <>
            <div className="messages-chat-header">
              <div className="chat-user-info">
                <div className="conversation-avatar small">
                  {activeConversation.userImage ? (
                    <img src={activeConversation.userImage} alt={activeConversation.username} />
                  ) : (
                    <div className="avatar-placeholder small">
                      <span>{activeConversation.username.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <span className="chat-username">{activeConversation.username}</span>
              </div>
              
              <div className="chat-actions">
                <button className="chat-action-btn">
                  <i className="fa fa-phone"></i>
                </button>
                <button className="chat-action-btn">
                  <i className="fa fa-video"></i>
                </button>
                <button className="chat-action-btn">
                  <i className="fa fa-info-circle"></i>
                </button>
              </div>
            </div>
            
            <div className="messages-chat-body">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message-bubble ${message.senderId === 'currentUser' ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {formatMessageTime(message.timestamp)}
                      {message.senderId === 'currentUser' && (
                        <span className={`read-status ${message.isRead ? 'read' : ''}`}>
                          ✓
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="messages-chat-footer">
              <form onSubmit={handleSendMessage} className="message-form">
                <button type="button" className="attachment-btn">
                  <i className="fa fa-paperclip"></i>
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                  <i className="fa fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="no-conversation-content">
              <div className="messages-icon">
                <i className="fa fa-comments"></i>
              </div>
              <h3>Your Messages</h3>
              <p>Send private photos and messages to a friend or group</p>
              <button className="new-message-btn large">Send Message</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
