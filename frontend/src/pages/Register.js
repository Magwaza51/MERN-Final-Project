import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    score: 0
  });

  const { register, isAuthenticated, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  // Password strength validation function
  const validatePasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      score: 0
    };

    // Calculate strength score
    strength.score = Object.values(strength).slice(0, 5).filter(Boolean).length;
    
    return strength;
  };

  const getPasswordStrengthText = (score) => {
    switch (score) {
      case 0:
      case 1: return { text: 'Very Weak', color: '#dc2626' };
      case 2: return { text: 'Weak', color: '#ea580c' };
      case 3: return { text: 'Fair', color: '#ca8a04' };
      case 4: return { text: 'Good', color: '#16a34a' };
      case 5: return { text: 'Strong', color: '#059669' };
      default: return { text: 'Very Weak', color: '#dc2626' };
    }
  };

  const isPasswordStrong = (strength) => {
    return strength.length && strength.uppercase && strength.lowercase && 
           strength.number && strength.special;
  };

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
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }

    setMessage('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    // Strong password validation
    if (!isPasswordStrong(passwordStrength)) {
      setMessage('Password must meet all security requirements listed below');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setMessage(result.error);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Join HealthConnect - Free Forever!</h2>
      <p style={{ textAlign: 'center', color: '#059669', fontWeight: 'bold', marginBottom: '20px' }}>
        🎉 Get full access to all features - completely free, no hidden costs!
      </p>
      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
          {formData.password && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px' 
              }}>
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                  Password Strength:
                </span>
                <span style={{ 
                  color: getPasswordStrengthText(passwordStrength.score).color,
                  fontWeight: 'bold'
                }}>
                  {getPasswordStrengthText(passwordStrength.score).text}
                </span>
              </div>
              
              {/* Password strength bar */}
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e5e7eb',
                borderRadius: '3px',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: `${(passwordStrength.score / 5) * 100}%`,
                  height: '100%',
                  backgroundColor: getPasswordStrengthText(passwordStrength.score).color,
                  borderRadius: '3px',
                  transition: 'all 0.3s ease'
                }}></div>
              </div>

              {/* Password requirements checklist */}
              <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                <div style={{ 
                  color: passwordStrength.length ? '#059669' : '#dc2626',
                  marginBottom: '2px'
                }}>
                  {passwordStrength.length ? '✓' : '✗'} At least 8 characters
                </div>
                <div style={{ 
                  color: passwordStrength.uppercase ? '#059669' : '#dc2626',
                  marginBottom: '2px'
                }}>
                  {passwordStrength.uppercase ? '✓' : '✗'} One uppercase letter (A-Z)
                </div>
                <div style={{ 
                  color: passwordStrength.lowercase ? '#059669' : '#dc2626',
                  marginBottom: '2px'
                }}>
                  {passwordStrength.lowercase ? '✓' : '✗'} One lowercase letter (a-z)
                </div>
                <div style={{ 
                  color: passwordStrength.number ? '#059669' : '#dc2626',
                  marginBottom: '2px'
                }}>
                  {passwordStrength.number ? '✓' : '✗'} One number (0-9)
                </div>
                <div style={{ 
                  color: passwordStrength.special ? '#059669' : '#dc2626'
                }}>
                  {passwordStrength.special ? '✓' : '✗'} One special character (!@#$%^&*)
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          {loading ? 'Creating Your Free Account...' : 'Join Free - No Payment Required'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;