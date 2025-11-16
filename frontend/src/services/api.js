import axios from 'axios';

// Configure axios base URL
const API_URL = process.env.REACT_APP_API_URL || 'https://mern-final-project-735f.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh token doesn't exist or refresh failed, logout
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error: Please try again later');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: The server took too long to respond');
    } else if (!error.response) {
      console.error('Network error: Please check your internet connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;