import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed, currentPage, onPageChange, isMobileMenuOpen, setIsMobileMenuOpen, isMobile: isMobileProp }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(currentPage || 'dashboard');
  const [isMobile, setIsMobile] = useState(false);

  // Use prop if provided, otherwise detect mobile
  useEffect(() => {
    if (isMobileProp !== undefined) {
      setIsMobile(isMobileProp);
    } else {
      const checkMobile = () => {
        const isMobileScreen = window.matchMedia('(max-width: 768px)').matches;
        setIsMobile(isMobileScreen);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [isMobileProp]);

  const menuSections = [
    {
      title: 'Health Dashboard',
      items: [
        { icon: '📊', label: 'Overview', path: '/dashboard', key: 'dashboard' },
        { icon: '📈', label: 'Analytics', path: '/analytics', key: 'analytics' }
      ]
    },
    {
      title: 'Health Tracking',
      items: [
        { icon: '💊', label: 'Medications', path: '/medications', key: 'medications' },
        { icon: '🌟', label: 'Wellness', path: '/wellness', key: 'wellness' },
        { icon: '📋', label: 'Medical Records', path: '/medical-records', key: 'records' }
      ]
    },
    {
      title: 'Medical Services',
      items: [
        { icon: '👨‍⚕️', label: 'Find Doctors', path: '/doctors', key: 'doctors' },
        { icon: '📅', label: 'Appointments', path: '/appointments', key: 'appointments' },
        { icon: '🤖', label: 'AI Assistant', path: '/ai-assistant', key: 'ai' }
      ]
    },
    {
      title: 'Telemedicine',
      items: [
        { icon: '📹', label: 'Video Consultation', path: '/telemedicine', key: 'telemedicine' },
        { icon: '💬', label: 'Chat Support', path: '/chat-support', key: 'chat' }
      ]
    },
    {
      title: 'Emergency',
      items: [
        { icon: '🚨', label: 'Emergency System', path: '/emergency', key: 'emergency', isEmergency: true },
        { icon: '📞', label: 'Emergency Contacts', path: '/emergency-contacts', key: 'contacts' }
      ]
    }
  ];

  const handleNavigation = (path, key) => {
    console.log('🎯 Navigation clicked - path:', path, 'key:', key, 'isMobile:', isMobile, 'isMobileMenuOpen:', isMobileMenuOpen);
    setActiveSection(key);
    
    // Use onPageChange if provided (for SidebarLayout), otherwise use navigate
    if (onPageChange) {
      onPageChange(key, path);
    } else {
      navigate(path);
    }
    
    // Auto-close mobile menu after navigation on mobile screens
    if (isMobile && setIsMobileMenuOpen) {
      console.log('📱 Closing mobile menu after navigation');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Debug logs */}
      {console.log('🔄 Sidebar render - isMobile:', isMobile, 'isMobileMenuOpen:', isMobileMenuOpen, 'isCollapsed:', isCollapsed)}
      
      {/* Mobile overlay - closes sidebar when clicked */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
        />
      )}
      
      <div className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Debug indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'absolute', 
            top: '5px', 
            right: '5px', 
            background: 'yellow', 
            color: 'black', 
            padding: '2px', 
            fontSize: '10px',
            zIndex: 10000
          }}>
            📱{isMobile ? 'Y' : 'N'} 📂{isMobileMenuOpen ? 'OPEN' : 'CLOSE'} 🔽{isCollapsed ? 'COLLAPSED' : 'VISIBLE'}
          </div>
        )}
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">🏥</div>
          {!isCollapsed && <span className="logo-text">HealthConnect</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Profile Section */}
      <div className="user-profile">
        <div className="avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-name">{user?.name || 'Guest User'}</div>
            <div className="user-role">Patient</div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            {!isCollapsed && <div className="section-title">{section.title}</div>}
            <ul className="nav-items">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <button
                    className={`nav-item ${activeSection === item.key ? 'active' : ''} ${item.isEmergency ? 'emergency-item' : ''}`}
                    onClick={() => handleNavigation(item.path, item.key)}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    {item.isEmergency && !isCollapsed && (
                      <span className="emergency-badge">!</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button className="nav-item settings-btn" title={isCollapsed ? 'Settings' : ''}>
          <span className="nav-icon">⚙️</span>
          {!isCollapsed && <span className="nav-label">Settings</span>}
        </button>
        <button 
          className="nav-item logout-btn" 
          onClick={logout}
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;