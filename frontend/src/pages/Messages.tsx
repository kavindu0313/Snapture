import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

interface User {
  id: string;
  username: string;
  profilePicture: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

const Messages: React.FC = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Mock data for conversations
  useEffect(() => {
    // In a real app, this would be an API call
    // Mock conversations data
    // This would be replaced with an API call to fetch conversations for the logged-in user
    const mockConversations: Conversation[] = [
      {
        id: '1',
        user: {
          id: '101',
          username: 'Isuru_photography',
          profilePicture: 'https://i.pinimg.com/736x/6a/b0/27/6ab02796eef930df247e93716324d736.jpg',
          isOnline: true
        },
        lastMessage: {
          id: 'm1',
          senderId: '101',
          receiverId: user?.id || '',
          content: 'Hey, did you see my latest photo?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        unreadCount: 2
      },
      {
        id: '2',
        user: {
          id: '102',
          username: 'Surith pabasara',
          profilePicture: 'https://i.pinimg.com/736x/cc/ec/ba/ccecba5acd6a3823754ce0a8eadd591c.jpg',
          isOnline: false,
          lastSeen: '2 hours ago'
        },
        lastMessage: {
          id: 'm2',
          senderId: user?.id || '',
          receiverId: '102',
          content: 'I love your new collection!',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true
        },
        unreadCount: 0
      },
      {
        id: '3',
        user: {
          id: '103',
          username: 'Kavindu_gihan_',
          profilePicture: 'https://i.pinimg.com/736x/50/67/7b/50677b79a519add395c930b2cd55977c.jpg',
          isOnline: true
        },
        lastMessage: {
          id: 'm3',
          senderId: '103',
          receiverId: user?.id || '',
          content: 'Can you share the editing technique you used?',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        unreadCount: 0
      },
      {
        id: '4',
        user: {
          id: '104',
          username: 'Saveen Fernando',
          profilePicture: 'https://i.pinimg.com/736x/c0/45/f6/c045f66252411eda5b7d130e2108c6a6.jpg',
          isOnline: true
        },
        lastMessage: {
          id: 'm4',
          senderId: '104',
          receiverId: user?.id || '',
          content: 'Can you tell me where is the location',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        unreadCount: 0
      }

    ];
    
    setConversations(mockConversations);
  }, [user]);

  // Mock socket connection
  useEffect(() => {
    // In a real app, this would connect to a real socket server
    // socketRef.current = io('http://localhost:8080');
    
    // Mock socket events
    const typingTimer = setInterval(() => {
      if (activeConversation) {
        // Randomly show typing indicator
        setIsTyping(Math.random() > 0.7);
      }
    }, 3000);
    
    return () => {
      clearInterval(typingTimer);
      // socketRef.current?.disconnect();
    };
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      // In a real app, this would be an API call
      // Mock messages for the active conversation
      // This would be replaced with an API call to fetch messages for the active conversation
      const mockMessages: Message[] = [
        {
          id: 'm101',
          senderId: activeConversation.user.id,
          receiverId: user?.id || '',
          content: 'Hi there! How are you?',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          read: true
        },
        {
          id: 'm102',
          senderId: user?.id || '',
          receiverId: activeConversation.user.id,
          content: 'I\'m good, thanks! Just working on some new photos.',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          read: true
        },
        {
          id: 'm103',
          senderId: activeConversation.user.id,
          receiverId: user?.id || '',
          content: 'That sounds awesome! Can\'t wait to see them.',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          read: true
        },
        {
          id: 'm104',
          senderId: user?.id || '',
          receiverId: activeConversation.user.id,
          content: 'I\'ll share them with you first!',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          read: true
        },
        {
          id: 'm105',
          senderId: activeConversation.user.id,
          receiverId: user?.id || '',
          imageUrl: 'https://source.unsplash.com/random/800x600?camera',
          content: 'Check out my new camera!',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        },
        {
          id: 'm106',
          senderId: activeConversation.user.id,
          receiverId: user?.id || '',
          content: activeConversation.lastMessage.content,
          timestamp: activeConversation.lastMessage.timestamp,
          read: false
        }
      ];
      
      setMessages(mockMessages);
      
      // Mark conversation as read
      setConversations(prev => 
        prev.map(c => c.id === activeConversation.id ? {...c, unreadCount: 0} : c)
      );
    }
  }, [activeConversation, user]);

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !imageFile) || !activeConversation) return;
    
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: user?.id || '',
      receiverId: activeConversation.user.id,
      content: newMessage,
      ...(imagePreview && { imageUrl: imagePreview }),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Update conversation with new last message
    setConversations(prev => 
      prev.map(c => c.id === activeConversation.id ? {
        ...c,
        lastMessage: newMsg
      } : c)
    );
    
    setNewMessage('');
    setImagePreview(null);
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className={`container mx-auto h-screen-minus-navbar ${darkMode ? 'text-dark-text' : ''}`}>
        <div className={`flex h-full ${darkMode ? 'bg-dark-secondary' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          {/* Conversations List */}
          <div className={`w-1/3 border-r ${darkMode ? 'border-gray-700 bg-dark-bg' : 'border-gray-200'}`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {conversations.map(conversation => (
                <div 
                  key={conversation.id} 
                  className={`flex items-center p-4 border-b cursor-pointer ${
                    darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                  } ${activeConversation?.id === conversation.id ? (darkMode ? 'bg-gray-800' : 'bg-blue-50') : ''}`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="relative">
                    <img 
                      src={conversation.user.profilePicture} 
                      alt={conversation.user.username} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{conversation.user.username}</h3>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className={`p-4 border-b flex items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <Link to={`/profile/${activeConversation.user.username}`}>
                    <img 
                      src={activeConversation.user.profilePicture} 
                      alt={activeConversation.user.username} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div className="ml-3">
                    <h3 className="font-medium">{activeConversation.user.username}</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activeConversation.user.isOnline ? 'Online' : `Last seen ${activeConversation.user.lastSeen || 'recently'}`}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'}`}>
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`mb-4 flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                          message.senderId === user?.id 
                            ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
                            : (darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200')
                        }`}
                      >
                        {message.imageUrl && (
                          <img 
                            src={message.imageUrl} 
                            alt="Shared" 
                            className="rounded-lg mb-2 w-full"
                          />
                        )}
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 flex justify-end items-center ${
                          message.senderId === user?.id 
                            ? 'text-blue-200' 
                            : (darkMode ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                          {formatTime(message.timestamp)}
                          {message.senderId === user?.id && (
                            <span className="ml-1">
                              {message.read ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex mb-4">
                      <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className={`p-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-20 rounded-lg"
                      />
                      <button 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Message Input */}
                <div className={`p-4 border-t flex ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <label htmlFor="image-upload" className={`p-2 rounded-full mr-2 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input 
                      id="image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className={`flex-1 px-4 py-2 rounded-full ${
                      darkMode 
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
                        : 'border border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    className={`ml-2 p-2 rounded-full ${
                      darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !imageFile}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select a conversation or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
