import axios from 'axios';
import { AuthResponse, User, Post, Comment, Like, Community, Notification } from '../types';

// Base URL for API calls
const API_URL = 'http://localhost:8080';

// API prefix for the backend
const API_PREFIX = '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL + API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent long-hanging requests
  timeout: 10000,
  // Add withCredentials to allow cookies to be sent
  withCredentials: true
});

// Define a type for queued promise
interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

// Flag to prevent multiple refresh calls
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: QueueItem[] = [];

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

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

// Add response interceptor to handle common errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or it's already been retried, reject the promise
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If we're already refreshing the token, add the failed request to the queue
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If no refresh token exists, redirect to login
    if (!refreshToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Try to refresh the token
    try {
      const response = await axios.post(
        `${API_URL}${API_PREFIX}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      originalRequest.headers['Authorization'] = 'Bearer ' + token;
      
      processQueue(null, token);
      isRefreshing = false;
      
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    }
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },
  register: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  ping: async (): Promise<any> => {
    const response = await api.get('/ping');
    return response.data;
  },
  status: async (): Promise<any> => {
    const response = await api.get('/api-status');
    return response.data;
  },
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
};

// User API
export const userAPI = {
  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  getProfileByUsername: async (username: string): Promise<User> => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },
  updateProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  searchUsers: async (query: string, type: 'username' | 'interest'): Promise<User[]> => {
    const param = type === 'username' ? 'username' : 'interest';
    const response = await api.get(`/users/search?${param}=${query}`);
    return response.data;
  },
  followUser: async (userId: string, followId: string): Promise<{ message: string }> => {
    const response = await api.post(`/users/${userId}/follow/${followId}`);
    return response.data;
  },
  unfollowUser: async (userId: string, unfollowId: string): Promise<{ message: string }> => {
    const response = await api.post(`/users/${userId}/unfollow/${unfollowId}`);
    return response.data;
  },
};

// Post API
export const postAPI = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
  },
  getPostById: async (postId: string): Promise<Post> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },
  getUserPosts: async (userId: string): Promise<Post[]> => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },
  getCommunityPosts: async (communityId: string): Promise<Post[]> => {
    const response = await api.get(`/posts/community/${communityId}`);
    return response.data;
  },
  getFeed: async (page: number = 0, size: number = 10): Promise<{ content: Post[], totalPages: number }> => {
    const response = await api.get(`/posts/feed?page=${page}&size=${size}`);
    return response.data;
  },
  createPost: async (formData: FormData): Promise<Post> => {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updatePost: async (postId: string, postData: Partial<Post>): Promise<Post> => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },
  deletePost: async (postId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
  searchPosts: async (query: string, type: 'tag' | 'caption'): Promise<Post[]> => {
    const param = type === 'tag' ? 'tag' : 'caption';
    const response = await api.get(`/posts/search?${param}=${query}`);
    return response.data;
  },
};

// Comment API
export const commentAPI = {
  getPostComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },
  createComment: async (commentData: Partial<Comment>): Promise<Comment> => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

// Like API
export const likeAPI = {
  getPostLikes: async (postId: string): Promise<Like[]> => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
  },
  toggleLike: async (postId: string): Promise<{ liked: boolean }> => {
    const response = await api.post('/likes', { postId });
    return response.data;
  },
  checkIfLiked: async (postId: string): Promise<{ liked: boolean }> => {
    const response = await api.get(`/likes/check?postId=${postId}`);
    return response.data;
  },
};

// Community API
export const communityAPI = {
  getAllCommunities: async (): Promise<Community[]> => {
    const response = await api.get('/communities');
    return response.data;
  },
  getCommunityById: async (communityId: string): Promise<Community> => {
    const response = await api.get(`/communities/${communityId}`);
    return response.data;
  },
  createCommunity: async (communityData: Partial<Community>): Promise<Community> => {
    const response = await api.post('/communities', communityData);
    return response.data;
  },
  updateCommunity: async (communityId: string, communityData: Partial<Community>): Promise<Community> => {
    const response = await api.put(`/communities/${communityId}`, communityData);
    return response.data;
  },
  deleteCommunity: async (communityId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/communities/${communityId}`);
    return response.data;
  },
  joinCommunity: async (communityId: string): Promise<{ message: string }> => {
    const response = await api.post(`/communities/${communityId}/join`);
    return response.data;
  },
  leaveCommunity: async (communityId: string): Promise<{ message: string }> => {
    const response = await api.post(`/communities/${communityId}/leave`);
    return response.data;
  },
  getUserCommunities: async (): Promise<Community[]> => {
    const response = await api.get('/communities/user');
    return response.data;
  },
  searchCommunities: async (query: string, type: 'name' | 'tag'): Promise<Community[]> => {
    const param = type === 'name' ? 'name' : 'tag';
    const response = await api.get(`/communities/search?${param}=${query}`);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },
  getUnreadNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },
  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      const response = await api.get('/notifications/count');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch notification count:', error);
      return { count: 0 };
    }
  },
  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

export default api;
