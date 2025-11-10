import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './SidebarLayout.css';

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="sidebar-layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>🏥 HealthConnect</h2>
        </div>
        
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">📊</span>
            Dashboard
          </a>
          <a href="/medical-records" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">📋</span>
            Medical Records
          </a>
          <a href="/appointments" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">📅</span>
            Appointments
          </a>
          <a href="/doctors" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">👨‍⚕️</span>
            Find Doctors
          </a>
          <a href="/ai-assistant" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">🤖</span>
            AI Assistant
          </a>
          <a href="/telemedicine" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">💻</span>
            Telemedicine
          </a>
          <a href="/analytics" className="nav-item" onClick={closeSidebar}>
            <span className="nav-icon">📈</span>
            Analytics
          </a>
          <a href="/emergency" className="nav-item emergency" onClick={closeSidebar}>
            <span className="nav-icon">🚨</span>
            Emergency
          </a>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <span>👤 {user?.name || 'Guest'}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-header">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="page-title">Health Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {user?.name || 'Guest'}</span>
          </div>
        </div>
        
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;