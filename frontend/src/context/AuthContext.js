import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

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
        // Demo mode: Create mock user instead of API call
        const mockUser = {
          _id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@healthconnect.com',
          createdAt: new Date().toISOString()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        dispatch({
          type: 'USER_LOADED',
          payload: { user: mockUser }
        });
        console.log('Demo mode: Mock user loaded');
      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: error.message || 'Authentication failed'
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
      // Demo mode: Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        user: {
          _id: 'demo-user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          createdAt: new Date().toISOString()
        },
        token: 'demo-token-' + Date.now()
      };
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: mockResponse
      });
      console.log('Demo mode: Registration simulated for', userData.email);
      return { success: true };
    } catch (error) {
      const message = 'Registration failed';
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
      // Demo mode: Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        user: {
          _id: 'demo-user-' + Date.now(),
          name: userData.email.split('@')[0], // Use email prefix as name
          email: userData.email,
          createdAt: new Date().toISOString()
        },
        token: 'demo-token-' + Date.now()
      };
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: mockResponse
      });
      console.log('Demo mode: Login simulated for', userData.email);
      return { success: true };
    } catch (error) {
      const message = 'Login failed';
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