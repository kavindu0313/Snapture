import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('edit-profile');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    privateAccount: false,
    emailNotifications: true,
    pushNotifications: true,
    language: 'English',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here to update user profile
    if (user) {
      updateUser({
        ...user,
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      });
    }
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // API call would go here to change password
    alert('Password changed successfully!');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              {/* Sidebar */}
              <div className={`w-full md:w-1/4 ${darkMode ? 'bg-dark-secondary border-dark-border' : 'bg-gray-50 border-gray-200'} border-r`}>
                <nav className="p-4">
                  <ul>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('edit-profile')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'edit-profile' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Edit Profile
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('change-password')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'change-password' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Change Password
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('privacy')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'privacy' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Privacy
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'notifications' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Notifications
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('appearance')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'appearance' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Appearance
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'security' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Security
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        onClick={() => setActiveTab('help')}
                        className={`w-full text-left px-3 py-2 rounded-md ${
                          activeTab === 'help' 
                            ? `${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                            : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        Help
                      </button>
                    </li>
                    <li className="mt-6">
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-3 py-2 rounded-md text-red-600 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              
              {/* Main Content Area */}
              <div className="w-full md:w-3/4 p-6">
                {activeTab === 'edit-profile' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                    <form onSubmit={handleSaveProfile}>
                      <div className="mb-4 flex items-center">
                        <img 
                          src={user?.profilePicture || 'https://via.placeholder.com/150'} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover mr-4"
                        />
                        <button 
                          type="button"
                          className={`px-3 py-1 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        >
                          Change Photo
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'change-password' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                    <div className="mb-4">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h3 className="font-medium">Private Account</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            When your account is private, only people you approve can see your photos and videos
                          </p>
                        </div>
                        <div className="ml-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privateAccount"
                              checked={formData.privateAccount}
                              onChange={handleCheckboxChange}
                              className="sr-only peer"
                            />
                            <div className={`relative w-11 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="border-t py-3">
                        <h3 className="font-medium mb-2">Activity Status</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                          Allow accounts you follow and anyone you message to see when you were last active
                        </p>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="activityStatus"
                            checked={true}
                            onChange={() => {}}
                            className="sr-only peer"
                          />
                          <div className={`relative w-11 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                        </label>
                      </div>
                      
                      <div className="border-t py-3">
                        <h3 className="font-medium mb-2">Story Sharing</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                          Allow people to share your stories as messages
                        </p>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="storySharing"
                            checked={true}
                            onChange={() => {}}
                            className="sr-only peer"
                          />
                          <div className={`relative w-11 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                    
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Email Notifications</h3>
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <span>Receive email notifications</span>
                      </label>
                      
                      <div className="ml-6 mt-2">
                        <label className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2" checked />
                          <span>Likes and comments</span>
                        </label>
                        <label className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2" checked />
                          <span>New followers</span>
                        </label>
                        <label className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2" checked />
                          <span>Direct messages</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-4 border-t pt-4">
                      <h3 className="font-medium mb-2">Push Notifications</h3>
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          name="pushNotifications"
                          checked={formData.pushNotifications}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <span>Receive push notifications</span>
                      </label>
                      
                      <div className="ml-6 mt-2">
                        <label className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2" checked />
                          <span>Likes and comments</span>
                        </label>
                        <label className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2" checked />
                          <span>New followers</span>
                        </label>
                        <label className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2" checked />
                          <span>Direct messages</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Theme</h3>
                      <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <button
                          onClick={toggleDarkMode}
                          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
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
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Language</h3>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-dark-bg border-dark-border' : 'border-gray-300'}`}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Security</h2>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        Add an extra layer of security to your account
                      </p>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        Set Up Two-Factor Authentication
                      </button>
                    </div>
                    
                    <div className="mb-6 border-t pt-4">
                      <h3 className="font-medium mb-2">Login Activity</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        Review your login activity and manage active sessions
                      </p>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      >
                        View Login Activity
                      </button>
                    </div>
                    
                    <div className="mb-6 border-t pt-4">
                      <h3 className="font-medium mb-2">Apps and Websites</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        Manage third-party apps and websites connected to your account
                      </p>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      >
                        Manage Apps
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'help' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
                    
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Help Center</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        Visit our help center to get help with your account
                      </p>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        Visit Help Center
                      </button>
                    </div>
                    
                    <div className="mb-4 border-t pt-4">
                      <h3 className="font-medium mb-2">Report a Problem</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        Let us know if something isn't working
                      </p>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      >
                        Report a Problem
                      </button>
                    </div>
                    
                    <div className="mb-4 border-t pt-4">
                      <h3 className="font-medium mb-2">Privacy and Security Help</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                        Learn how to keep your account secure
                      </p>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      >
                        Privacy and Security Help
                      </button>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        About • Terms • Privacy • Cookies • © 2025 Snapture
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
