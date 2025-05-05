import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notifications as notificationAPI } from '../../services/apiConfig';
import { withErrorHandling } from '../../services/errorHandler';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Fetch unread notification count
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        // Use our error handling utility to handle errors gracefully
        const response = await withErrorHandling(
          () => notificationAPI.getUnreadCount(),
          { count: 0 } // Fallback value if the API call fails
        );
        setUnreadCount(response.count);
      };

      fetchUnreadCount();
      
      // Set up interval to check for new notifications
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${darkMode ? 'bg-dark-secondary text-dark-text' : 'bg-white'} shadow sticky top-0 z-50`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                Snapture
              </Link>
            </div>
            <div className="hidden md:flex md:ml-6 md:items-center md:space-x-4">
              <Link to="/home" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                Home
              </Link>
              <Link to="/explore" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                Explore
              </Link>
              <Link to="/stories" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                Stories
              </Link>
              <Link to="/messages" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                Messages
              </Link>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center">
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`w-64 px-3 py-2 text-sm border ${darkMode ? 'bg-dark-bg border-gray-600 text-gray-200' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      // Simulate autocomplete suggestions
                      if (e.target.value.trim()) {
                        const suggestions = ['#' + e.target.value, 'user:' + e.target.value, e.target.value + ' recent', e.target.value + ' popular'];
                        setSearchSuggestions(suggestions.slice(0, 4));
                        setShowSuggestions(true);
                      } else {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </form>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className={`absolute z-10 w-64 mt-1 ${darkMode ? 'bg-dark-bg border-gray-700' : 'bg-white'} border rounded-md shadow-lg`}>
                    {searchSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className={`px-4 py-2 cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                          navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className={`px-3 py-2 mr-4 text-sm font-medium text-white ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} rounded-md flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Post
                </Link>
                
                <Link to="/communities" className={`mr-4 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </Link>
                
                <Link to="/notifications" className={`relative mr-4 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 mr-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={toggleMenu}
                      className={`flex text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      <img
                        className="object-cover w-8 h-8 rounded-full"
                        src={user?.profilePicture || 'https://via.placeholder.com/150'}
                        alt={user?.username}
                      />
                    </button>
                  </div>
                  
                  {isMenuOpen && (
                    <div className={`absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right ${darkMode ? 'bg-dark-bg' : 'bg-white'} rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}>
                      <Link
                        to={`/profile/${user?.username}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-sm text-left ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 ml-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
