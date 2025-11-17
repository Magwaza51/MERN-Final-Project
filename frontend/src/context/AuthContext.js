import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        // Get current user data from backend
        const response = await api.get('/api/users/profile');
        
        dispatch({
          type: 'USER_LOADED',
          payload: { user: response.data.user }
        });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({
          type: 'AUTH_ERROR',
          payload: error.response?.data?.message || 'Authentication failed'
        });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: null });
    }
  };

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await api.post('/api/auth/register', userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: response.data
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.[0]?.msg ||
                     'Registration failed. Please try again.';
      
      dispatch({
        type: 'REGISTER_FAIL',
        payload: message
      });
      
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (userData) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await api.post('/api/auth/login', {
        email: userData.email,
        password: userData.password
      });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        message = '❌ Invalid email or password. Please check your credentials.';
      } else if (error.response?.status === 404) {
        message = '❌ Account not found. Please register first.';
      } else if (error.response?.data?.message) {
        message = '❌ ' + error.response.data.message;
      } else if (error.response?.data?.errors?.[0]?.msg) {
        message = '❌ ' + error.response.data.errors[0].msg;
      }
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message
      });
      
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        clearError,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};