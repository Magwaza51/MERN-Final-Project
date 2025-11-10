import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Make addNotification available globally for Socket.io integration
  useEffect(() => {
    window.addNotification = addNotification;
    return () => {
      delete window.addNotification;
    };
  }, []);

  // Simulate real-time notifications (replaced by Socket.io in production)
  useEffect(() => {
    const interval = setInterval(() => {
      // Check for new notifications every 30 seconds
      checkForNewNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkForNewNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Demo mode - use mock notifications instead of API calls
      console.log('Running in demo mode - using mock notifications');
      
      // Occasionally add demo notifications
      if (Math.random() < 0.1) { // 10% chance
        const demoNotifications = [
          {
            id: Date.now(),
            type: 'appointment_reminder',
            title: 'Appointment Reminder',
            message: 'You have an appointment tomorrow with Dr. Sarah Johnson',
            doctorName: 'Sarah Johnson',
            timestamp: new Date(),
            read: false
          }
        ];
        
        setNotifications(prev => [...demoNotifications, ...prev]);
        setUnreadCount(prev => prev + demoNotifications.length);
        
        // Show toast for demo notifications
        demoNotifications.forEach(notification => {
          showNotificationToast(notification);
        });
      }
    } catch (error) {
      console.log('Demo mode error handling:', error);
    }
  };

  const showNotificationToast = (notification) => {
    const toastConfig = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (notification.type) {
      case 'appointment_confirmed':
        toast.success(`✅ Appointment confirmed with Dr. ${notification.doctorName}`, toastConfig);
        break;
      case 'appointment_reminder':
        toast.info(`⏰ Reminder: Appointment tomorrow with Dr. ${notification.doctorName}`, toastConfig);
        break;
      case 'appointment_cancelled':
        toast.warning(`❌ Appointment cancelled with Dr. ${notification.doctorName}`, toastConfig);
        break;
      case 'prescription_ready':
        toast.success(`💊 Your prescription is ready for pickup`, toastConfig);
        break;
      default:
        toast.info(notification.message, toastConfig);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      timestamp: notification.timestamp || new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications
    setUnreadCount(prev => prev + 1);
    showNotificationToast(newNotification);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    showNotificationToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};