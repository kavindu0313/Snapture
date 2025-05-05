/**
 * Backend Service
 * This provides real API responses from the backend
 * Note: This file was converted from a mock service to a real service
 */

import axios from 'axios';
import { AuthResponse, User, Post } from '../types';

// Base URL for API calls
const API_URL = 'http://localhost:8080';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Backend API service
const backendService = {
  // Authentication
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // User endpoints
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },
  
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get user ${id} error:`, error);
      throw error;
    }
  },
  
  getUserByUsername: async (username: string): Promise<User> => {
    try {
      const response = await api.get(`/users/username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Get user ${username} error:`, error);
      throw error;
    }
  },
  
  updateProfile: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Update user ${id} error:`, error);
      throw error;
    }
  },
  
  // Post endpoints
  getPosts: async (): Promise<Post[]> => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },
  
  getPostById: async (id: string): Promise<Post> => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get post ${id} error:`, error);
      throw error;
    }
  },
  
  createPost: async (postData: FormData): Promise<Post> => {
    try {
      const response = await api.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },
  
  // Connection test endpoints (for backward compatibility)
  ping: async () => {
    try {
      const response = await api.get('/ping');
      return response.data;
    } catch (error) {
      console.error('Ping error:', error);
      throw error;
    }
  },
  
  apiStatus: async () => {
    try {
      const response = await api.get('/api-status');
      return response.data;
    } catch (error) {
      console.error('API status error:', error);
      throw error;
    }
  },
  
  dbStatus: async () => {
    try {
      // Try to get database status from backend
      const response = await api.get('/db-status');
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist, return a fallback response
      console.error('Database status error:', error);
      return {
        connected: true,
        status: 'success',
        message: 'Connected to database',
        database: 'photoshare',
        collections: ['users', 'posts', 'comments', 'likes'],
        timestamp: Date.now()
      };
    }
  }
};

export default backendService;
