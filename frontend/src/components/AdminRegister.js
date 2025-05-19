import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminRegister.css';

function AdminRegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'ADMIN'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to register admin with:', { email: formData.email, name: formData.name });
      
      // Submit to backend API
      const response = await axios.post('http://localhost:8080/api/admin/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role
      });
      
      console.log('Admin registration response:', response.data);
      
      setSuccess('Admin account created successfully! You can now log in.');
      
      // Clear the form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: 'ADMIN'
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
      
    } catch (error) {
      console.error('Admin registration error:', error);
      console.error('Error response data:', error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <div className="admin-register-header">
          <h1>Create Admin Account</h1>
          <p>Register a new administrator for Snapture</p>
        </div>
        
        {error && <div className="admin-register-error">{error}</div>}
        {success && <div className="admin-register-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@snapture.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Admin User"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
        
        <div className="admin-register-footer">
          <p>Already have an admin account? <Link to="/admin/login">Sign in</Link></p>
          <p className="admin-register-help">For authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
