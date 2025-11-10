import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { useNotifications } from '../context/NotificationContext';
// import NotificationDropdown from './NotificationDropdown';
// import ConnectionStatus from './ConnectionStatus';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🏥 HealthConnect <span style={{ fontSize: '0.6em', background: '#059669', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>FREE</span>
          </Link>
        </h1>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <span className="welcome-text">Welcome, {user?.name}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/doctors" className="nav-link">Find Doctors</Link>
              <Link to="/advanced-appointments" className="nav-link">📅 Appointments</Link>
              <Link to="/medical-records" className="nav-link">📋 Records</Link>
              <Link to="/ai-assistant" className="nav-link">🤖 AI Assistant</Link>
              <Link to="/telemedicine" className="nav-link">📹 Telemedicine</Link>
              <Link to="/emergency" className="nav-link emergency-btn">🚨 Emergency</Link>
              
              {/* Notification Bell - Removed for deployment */}
              {/* <div className="notification-wrapper">
                <button 
                  className="notification-bell"
                  onClick={toggleNotifications}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                )}
              </div> */}
              
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
      {/* <ConnectionStatus /> */}
    </nav>
  );
};

export default Navbar;