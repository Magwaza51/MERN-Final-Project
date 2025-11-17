import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { login, isAuthenticated, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setMessage(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email || !formData.password) {
      setMessage('Please fill in all fields');
      return;
    }

    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setMessage(result.error);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Welcome Back to HealthConnect</h2>
      <p style={{ textAlign: 'center', color: '#4f46e5', fontWeight: 'bold', marginBottom: '20px' }}>
        🏥 Access your free healthcare dashboard
      </p>
      {message && (
        <div 
          className="alert alert-error" 
          style={{ 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fca5a5',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Join free - no payment required!</Link>
      </p>
    </div>
  );
};

export default Login;