import axios, { AxiosError } from 'axios';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  SERVER = 'server',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// Error response structure
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: string;
  status?: number;
}

/**
 * Handles API errors and returns a standardized error response
 */
export const handleApiError = (error: any): ErrorResponse => {
  // Default error response
  const errorResponse: ErrorResponse = {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
  };

  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Network errors (no response from server)
    if (axiosError.code === 'ERR_NETWORK') {
      errorResponse.type = ErrorType.NETWORK;
      errorResponse.message = 'Unable to connect to the server. Please check your internet connection.';
      errorResponse.details = axiosError.message;
      return errorResponse;
    }

    // Server responded with an error status
    if (axiosError.response) {
      errorResponse.status = axiosError.response.status;
      
      // Authentication errors
      if (axiosError.response.status === 401) {
        errorResponse.type = ErrorType.AUTH;
        errorResponse.message = 'Authentication required. Please log in.';
        
        // If user was previously logged in, their token might have expired
        if (localStorage.getItem('token')) {
          errorResponse.message = 'Your session has expired. Please log in again.';
        }
      } 
      // Forbidden
      else if (axiosError.response.status === 403) {
        errorResponse.type = ErrorType.AUTH;
        errorResponse.message = 'You do not have permission to perform this action.';
      } 
      // Validation errors
      else if (axiosError.response.status === 400) {
        errorResponse.type = ErrorType.VALIDATION;
        errorResponse.message = 'Invalid input. Please check your data and try again.';
      } 
      // Server errors
      else if (axiosError.response.status >= 500) {
        errorResponse.type = ErrorType.SERVER;
        errorResponse.message = 'The server encountered an error. Please try again later.';
      }

      // Add details from the response if available
      if (axiosError.response.data) {
        if (typeof axiosError.response.data === 'string') {
          errorResponse.details = axiosError.response.data;
        } else {
          const responseData = axiosError.response.data as Record<string, any>;
          if (responseData.message) {
            errorResponse.details = responseData.message as string;
          } else if (responseData.error) {
            errorResponse.details = responseData.error as string;
          }
        }
      }
    }
  } else if (error instanceof Error) {
    // Handle regular JavaScript errors
    errorResponse.message = error.message;
    errorResponse.details = error.stack;
  }

  return errorResponse;
};

/**
 * Handles errors in a user-friendly way
 * Returns a user-friendly message and logs the detailed error
 */
export const handleUserError = (error: any): string => {
  const errorResponse = handleApiError(error);
  
  // Log the full error details for debugging
  console.error('Error details:', errorResponse);
  
  // Return a user-friendly message based on the error type
  return errorResponse.message;
};

/**
 * Utility to wrap API calls with error handling
 */
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  fallbackValue?: T
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const errorResponse = handleApiError(error);
    console.error('API Error:', errorResponse);
    
    // Handle authentication errors by redirecting to login
    if (errorResponse.type === ErrorType.AUTH) {
      // Clear token if it's expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Return fallback value if provided
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    
    // Re-throw the error if no fallback
    throw error;
  }
};

export default {
  handleApiError,
  handleUserError,
  withErrorHandling,
  ErrorType
};
