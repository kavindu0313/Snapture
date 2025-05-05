import { AuthResponse, User, Post, Comment, Like, Community, Notification } from '../types';
import * as mockApi from './mockApi';
import realApi, { 
  authAPI, 
  userAPI, 
  postAPI, 
  commentAPI, 
  likeAPI, 
  communityAPI, 
  notificationAPI 
} from './api';

// Flag to control whether to use mock data by default
// Set to true during development or when backend is unavailable
const USE_MOCK_API = true;

// Track backend availability
let isBackendAvailable = false;

// Function to check if backend is available
const checkBackendAvailability = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/ping', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Short timeout to avoid long waits
      signal: AbortSignal.timeout(2000)
    });
    isBackendAvailable = response.ok;
    console.log(`Backend status check: ${isBackendAvailable ? 'Available' : 'Unavailable'}`);
    return isBackendAvailable;
  } catch (error) {
    isBackendAvailable = false;
    console.log('Backend unavailable:', error);
    return false;
  }
};

// Periodically check backend availability
setInterval(checkBackendAvailability, 30000); // Check every 30 seconds

// Initial check
checkBackendAvailability();

// Create API services with intelligent fallback to mock data if real API fails
const createFallbackAPI = (realMethod: any, mockMethod: any) => {
  return async (...args: any[]) => {
    // If we're explicitly using mock API or backend is known to be unavailable, use mock data directly
    if (USE_MOCK_API || !isBackendAvailable) {
      return mockMethod(...args);
    }
    
    try {
      // Try the real API first
      return await realMethod(...args);
    } catch (error: any) {
      // If it's a network error, mark backend as unavailable
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        isBackendAvailable = false;
      }
      
      console.warn(`Real API call failed, using mock data as fallback:`, error);
      
      // Use mock data as fallback
      try {
        return await mockMethod(...args);
      } catch (mockError) {
        console.error('Mock API also failed:', mockError);
        throw mockError; // If even the mock fails, propagate the error
      }
    }
  };
};

// Create fallback versions of all API methods
const createServiceWithFallback = (realService: any, mockService: any) => {
  const fallbackService: any = {};
  
  // For each method in the real service, create a fallback version
  Object.keys(realService).forEach(key => {
    if (typeof realService[key] === 'function') {
      fallbackService[key] = createFallbackAPI(realService[key], mockService[key]);
    }
  });
  
  return fallbackService;
};

// Create fallback services
const authWithFallback = createServiceWithFallback(authAPI, mockApi.authAPI);
const usersWithFallback = createServiceWithFallback(userAPI, mockApi.userAPI);
const postsWithFallback = createServiceWithFallback(postAPI, mockApi.postAPI);
const commentsWithFallback = createServiceWithFallback(commentAPI, mockApi.commentAPI);
const likesWithFallback = createServiceWithFallback(likeAPI, mockApi.likeAPI);
const communitiesWithFallback = createServiceWithFallback(communityAPI, mockApi.communityAPI);
const notificationsWithFallback = createServiceWithFallback(notificationAPI, mockApi.notificationAPI);

// Export the services with fallback
export const auth = authWithFallback;
export const users = usersWithFallback;
export const posts = postsWithFallback;
export const comments = commentsWithFallback;
export const likes = likesWithFallback;
export const communities = communitiesWithFallback;
export const notifications = notificationsWithFallback;

// Export a function to toggle between mock and real API
export const setUseMockApi = (useMock: boolean) => {
  console.log(`Switching to ${useMock ? 'mock' : 'real'} API`);
  (window as any).USE_MOCK_API = useMock; // For debugging in console
  return USE_MOCK_API;
};
