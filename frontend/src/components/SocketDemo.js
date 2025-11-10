import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';
import ChatWindow from './ChatWindow';
import './SocketDemo.css';

const SocketDemo = () => {
  const { socket, isConnected, emitAppointmentBooked, sendMessage } = useSocket();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [showChat, setShowChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [demoData, setDemoData] = useState({
    doctorName: 'Dr. Sarah Johnson',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '14:00'
  });

  useEffect(() => {
    if (socket) {
      // Listen for demo events
      socket.on('demo_notification', (data) => {
        toast.success(`Demo: ${data.message}`);
        addNotification({
          type: 'demo',
          title: 'Socket.io Demo',
          message: data.message,
          priority: 'medium'
        });
      });

      // Listen for user status updates
      socket.on('user_status_update', (data) => {
        setOnlineUsers(data.onlineUsers || []);
      });

      return () => {
        socket.off('demo_notification');
        socket.off('user_status_update');
      };
    }
  }, [socket, addNotification]);

  const sendDemoNotification = () => {
    if (socket && isConnected) {
      socket.emit('demo_notification', {
        userId: user._id,
        message: 'This is a real-time notification demo!',
        timestamp: new Date()
      });
      toast.info('Demo notification sent!');
    } else {
      toast.error('Socket.io not connected');
    }
  };

  const simulateAppointmentBooking = () => {
    if (socket && isConnected) {
      const appointmentData = {
        patientName: user.name,
        doctorName: demoData.doctorName,
        date: demoData.appointmentDate,
        time: demoData.appointmentTime,
        type: 'demonstration'
      };

      // Emit appointment booked event
      emitAppointmentBooked(appointmentData);
      
      // Add local notification
      addNotification({
        type: 'appointment_confirmed',
        title: 'Appointment Booked',
        message: `Demo appointment with ${demoData.doctorName} scheduled for ${demoData.appointmentDate}`,
        priority: 'high'
      });

      toast.success('Demo appointment booking event sent!');
    } else {
      toast.error('Socket.io not connected');
    }
  };

  const simulateHealthAlert = () => {
    if (socket && isConnected) {
      addNotification({
        type: 'health_alert',
        title: 'Health Alert Demo',
        message: 'Demo: Blood pressure reading is above normal range (145/95)',
        priority: 'high'
      });

      toast.warning('Demo health alert triggered!');
    }
  };

  const simulatePaymentNotification = () => {
    if (socket && isConnected) {
      addNotification({
        type: 'payment_success',
        title: 'Payment Demo',
        message: 'Demo: Payment of $150 processed successfully',
        priority: 'medium'
      });

      toast.success('Demo payment notification sent!');
    }
  };

  const sendTestMessage = () => {
    if (socket && isConnected) {
      // Simulate sending a message to yourself for demo
      socket.emit('demo_message', {
        senderId: user._id,
        message: 'This is a test real-time message!',
        timestamp: new Date()
      });
      
      toast.info('Demo message sent!');
    }
  };

  const testConnectionStatus = () => {
    if (socket) {
      if (isConnected) {
        toast.success('✅ Socket.io is connected and working!');
      } else {
        toast.error('❌ Socket.io is not connected');
      }
    } else {
      toast.error('❌ Socket instance not found');
    }
  };

  return (
    <div className="socket-demo">
      <div className="demo-header">
        <h2>🔥 Socket.io Real-Time Demo</h2>
        <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="indicator-dot"></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="demo-grid">
        {/* Connection Status */}
        <div className="demo-card">
          <h3>📡 Connection Status</h3>
          <div className="status-info">
            <p><strong>Socket ID:</strong> {socket?.id || 'Not connected'}</p>
            <p><strong>User ID:</strong> {user?._id || 'Not logged in'}</p>
            <p><strong>Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
          </div>
          <button 
            className="demo-btn primary"
            onClick={testConnectionStatus}
          >
            Test Connection
          </button>
        </div>

        {/* Real-Time Notifications */}
        <div className="demo-card">
          <h3>🔔 Real-Time Notifications</h3>
          <div className="demo-controls">
            <button 
              className="demo-btn success"
              onClick={sendDemoNotification}
              disabled={!isConnected}
            >
              Send Demo Notification
            </button>
            <button 
              className="demo-btn warning"
              onClick={simulateHealthAlert}
              disabled={!isConnected}
            >
              Health Alert Demo
            </button>
            <button 
              className="demo-btn info"
              onClick={simulatePaymentNotification}
              disabled={!isConnected}
            >
              Payment Demo
            </button>
          </div>
        </div>

        {/* Appointment Booking Demo */}
        <div className="demo-card">
          <h3>📅 Appointment Booking</h3>
          <div className="appointment-form">
            <div className="form-group">
              <label>Doctor:</label>
              <input
                type="text"
                value={demoData.doctorName}
                onChange={(e) => setDemoData(prev => ({ ...prev, doctorName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={demoData.appointmentDate}
                onChange={(e) => setDemoData(prev => ({ ...prev, appointmentDate: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={demoData.appointmentTime}
                onChange={(e) => setDemoData(prev => ({ ...prev, appointmentTime: e.target.value }))}
              />
            </div>
            <button 
              className="demo-btn primary"
              onClick={simulateAppointmentBooking}
              disabled={!isConnected}
            >
              Simulate Booking
            </button>
          </div>
        </div>

        {/* Real-Time Messaging */}
        <div className="demo-card">
          <h3>💬 Real-Time Messaging</h3>
          <div className="messaging-controls">
            <button 
              className="demo-btn success"
              onClick={sendTestMessage}
              disabled={!isConnected}
            >
              Send Test Message
            </button>
            <button 
              className="demo-btn primary"
              onClick={() => setShowChat(true)}
              disabled={!isConnected}
            >
              Open Demo Chat
            </button>
          </div>
          <p className="demo-note">
            💡 Real-time messaging enables instant communication between patients and doctors
          </p>
        </div>

        {/* Socket.io Events */}
        <div className="demo-card">
          <h3>⚡ Socket.io Events</h3>
          <div className="events-list">
            <div className="event-item">
              <span className="event-name">appointment_booked</span>
              <span className="event-desc">New appointment notifications</span>
            </div>
            <div className="event-item">
              <span className="event-name">notification</span>
              <span className="event-desc">General real-time notifications</span>
            </div>
            <div className="event-item">
              <span className="event-name">receive_message</span>
              <span className="event-desc">Real-time chat messages</span>
            </div>
            <div className="event-item">
              <span className="event-name">doctor_status</span>
              <span className="event-desc">Doctor online/offline status</span>
            </div>
            <div className="event-item">
              <span className="event-name">video_call_request</span>
              <span className="event-desc">Incoming video call requests</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="demo-card">
          <h3>📊 Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Latency:</span>
              <span className="metric-value">~10ms</span>
            </div>
            <div className="metric">
              <span className="metric-label">Transport:</span>
              <span className="metric-value">WebSocket</span>
            </div>
            <div className="metric">
              <span className="metric-label">Events/min:</span>
              <span className="metric-value">Real-time</span>
            </div>
            <div className="metric">
              <span className="metric-label">Reliability:</span>
              <span className="metric-value">99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="demo-instructions">
        <h3>🎯 How to Test Socket.io Features:</h3>
        <ol>
          <li><strong>Check Connection:</strong> Verify that Socket.io is connected (green indicator)</li>
          <li><strong>Test Notifications:</strong> Click notification buttons to see real-time alerts</li>
          <li><strong>Simulate Booking:</strong> Try the appointment booking simulation</li>
          <li><strong>Real-time Chat:</strong> Open the demo chat to test messaging</li>
          <li><strong>Multiple Tabs:</strong> Open multiple browser tabs to see real-time sync</li>
          <li><strong>Network Testing:</strong> Disable/enable network to test reconnection</li>
        </ol>
      </div>

      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          recipientId="demo_user"
          recipientName="Demo User"
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default SocketDemo;