import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting admin login with:', { email });
      
      // Connect to the actual backend API
      const response = await axios.post('http://localhost:8080/api/admin/login', { email, password });
      
      console.log('Admin login response:', response.data);
      
      // If we get here, login was successful
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminId', response.data.id);
      localStorage.setItem('adminName', response.data.name);
      
      setLoading(false);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      console.error('Error response data:', error.response?.data);
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Snapture Admin</h1>
          <p>Sign in to access the admin dashboard</p>
        </div>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@snapture.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>For admin access only</p>
          <p className="admin-login-help">Need help? Contact the system administrator</p>
          <div className="admin-register-link">
            <Link to="/admin/register" className="register-button">Register New Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
