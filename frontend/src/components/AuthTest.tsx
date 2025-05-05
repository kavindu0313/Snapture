import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthTest: React.FC = () => {
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  // Registration state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [registerStatus, setRegisterStatus] = useState<string | null>(null);

  // Update token state when localStorage changes
  useEffect(() => {
    const checkTokens = () => {
      setToken(localStorage.getItem('token'));
      setRefreshToken(localStorage.getItem('refreshToken'));
    };
    
    // Check tokens initially
    checkTokens();
    
    // Set up interval to check tokens
    const interval = setInterval(checkTokens, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('Attempting to login...');
    
    try {
      const response = await authAPI.login(username, password);
      setLoginStatus('Login successful!');
      setToken(response.token);
      setRefreshToken(response.refreshToken);
    } catch (error: any) {
      setLoginStatus(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterStatus('Attempting to register...');
    
    try {
      const userData = {
        username: newUsername,
        password: newPassword,
        email,
        fullName
      };
      
      await authAPI.register(userData);
      setRegisterStatus('Registration successful! You can now login.');
    } catch (error: any) {
      setRegisterStatus(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setToken(null);
    setRefreshToken(null);
    setLoginStatus('Logged out successfully');
  };

  // Handle manual token refresh
  const handleRefreshToken = async () => {
    if (!refreshToken) {
      setLoginStatus('No refresh token available. Please login again.');
      return;
    }
    
    try {
      setLoginStatus('Refreshing token...');
      const response = await authAPI.refreshToken(refreshToken);
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      setLoginStatus('Token refreshed successfully!');
    } catch (error: any) {
      setLoginStatus(`Token refresh failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md dark:bg-gray-800 my-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Authentication Test</h2>
      
      {token ? (
        <div className="mb-6">
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            <p className="font-semibold">You are logged in!</p>
            <p className="text-sm mt-1">JWT Token: {token.substring(0, 20)}...</p>
            {refreshToken && <p className="text-sm mt-1">Refresh Token: {refreshToken.substring(0, 20)}...</p>}
          </div>
          <div className="flex space-x-3 mt-4">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
            <button 
              onClick={handleRefreshToken}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Token
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Login Form */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Login
              </button>
            </form>
            {loginStatus && (
              <div className={`mt-3 p-2 rounded text-sm ${loginStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {loginStatus}
              </div>
            )}
          </div>

          {/* Registration Form */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Register</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Register
              </button>
            </form>
            {registerStatus && (
              <div className={`mt-3 p-2 rounded text-sm ${registerStatus.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {registerStatus}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AuthTest;
