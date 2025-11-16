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
    <>
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

      <style>{`
        .navbar {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          padding: 15px 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar h1 {
          font-size: 1.5rem;
          margin: 0;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 8px 12px;
          border-radius: 5px;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .nav-link.emergency-btn {
          background: #dc2626;
          animation: pulse-emergency 2s infinite;
        }

        @keyframes pulse-emergency {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .welcome-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .btn {
          padding: 8px 20px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 10px 0;
          }

          .navbar h1 {
            font-size: 1.2rem;
          }

          .nav-links {
            gap: 10px;
            font-size: 0.85rem;
          }

          .welcome-text {
            display: none;
          }

          .nav-link {
            padding: 6px 10px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;