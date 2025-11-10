import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server:', newSocket.id);
        setIsConnected(true);
        
        // Join user's personal room
        newSocket.emit('join', user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      // Listen for notifications
      newSocket.on('notification', (data) => {
        console.log('Received notification:', data);
        handleNotification(data);
      });

      // Listen for real-time messages
      newSocket.on('receive_message', (data) => {
        console.log('Received message:', data);
        handleMessage(data);
      });

      // Listen for appointment updates
      newSocket.on('appointment_update', (data) => {
        console.log('Appointment update:', data);
        handleAppointmentUpdate(data);
      });

      // Listen for doctor status changes
      newSocket.on('doctor_status', (data) => {
        console.log('Doctor status update:', data);
        handleDoctorStatusUpdate(data);
      });

      // Listen for video call requests
      newSocket.on('video_call_request', (data) => {
        console.log('Incoming video call:', data);
        handleVideoCallRequest(data);
      });

      // Listen for video call ended
      newSocket.on('video_call_ended', (data) => {
        console.log('Video call ended:', data);
        handleVideoCallEnded(data);
      });

      // Error handling
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection error. Some features may not work properly.');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const handleNotification = (notification) => {
    // Show toast notification based on priority
    const toastOptions = {
      position: "top-right",
      autoClose: notification.priority === 'high' ? 10000 : 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (notification.priority) {
      case 'high':
        toast.error(notification.message, toastOptions);
        break;
      case 'medium':
        toast.warning(notification.message, toastOptions);
        break;
      case 'low':
        toast.info(notification.message, toastOptions);
        break;
      default:
        toast(notification.message, toastOptions);
    }

    // Add to notification center (if using NotificationContext)
    if (window.addNotification) {
      window.addNotification(notification);
    }

    // Play notification sound for high priority
    if (notification.priority === 'high') {
      playNotificationSound();
    }
  };

  const handleMessage = (message) => {
    // Handle real-time chat messages
    toast.info(`New message from user ${message.senderId}`, {
      onClick: () => {
        // Navigate to chat or open message modal
        window.location.href = `/chat/${message.senderId}`;
      }
    });
  };

  const handleAppointmentUpdate = (update) => {
    // Handle appointment status changes
    toast.success(`Appointment ${update.status}`, {
      onClick: () => {
        window.location.href = '/appointments';
      }
    });
  };

  const handleDoctorStatusUpdate = (statusUpdate) => {
    const { doctorId, status } = statusUpdate;
    
    if (status === 'online') {
      setOnlineUsers(prev => new Set([...prev, doctorId]));
    } else {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(doctorId);
        return newSet;
      });
    }
  };

  const handleVideoCallRequest = (callData) => {
    // Show incoming call notification
    toast.info(
      <div>
        <p>Incoming video call from {callData.fromUserName}</p>
        <button onClick={() => acceptCall(callData)}>Accept</button>
        <button onClick={() => rejectCall(callData)}>Reject</button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false
      }
    );
  };

  const handleVideoCallEnded = (callData) => {
    toast.info('Video call ended');
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play notification sound:', e));
    } catch (error) {
      console.log('Notification sound not available');
    }
  };

  // Socket event emitters
  const emitAppointmentBooked = (appointmentData) => {
    if (socket) {
      socket.emit('appointment_booked', appointmentData);
    }
  };

  const emitAppointmentStatusChange = (statusData) => {
    if (socket) {
      socket.emit('appointment_status_change', statusData);
    }
  };

  const sendMessage = (recipientId, message, messageType = 'text') => {
    if (socket) {
      socket.emit('send_message', {
        senderId: user._id,
        recipientId,
        message,
        messageType
      });
    }
  };

  const initiateVideoCall = (recipientId, callData) => {
    if (socket) {
      socket.emit('video_call_request', {
        fromUserId: user._id,
        toUserId: recipientId,
        callData
      });
    }
  };

  const acceptCall = (callData) => {
    if (socket) {
      socket.emit('video_call_accepted', callData);
    }
  };

  const rejectCall = (callData) => {
    if (socket) {
      socket.emit('video_call_rejected', callData);
    }
  };

  const endCall = (callData) => {
    if (socket) {
      socket.emit('video_call_ended', callData);
    }
  };

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', roomId);
    }
  };

  const updateOnlineStatus = (status) => {
    if (socket) {
      socket.emit('update_status', { userId: user._id, status });
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    // Event emitters
    emitAppointmentBooked,
    emitAppointmentStatusChange,
    sendMessage,
    initiateVideoCall,
    acceptCall,
    rejectCall,
    endCall,
    joinRoom,
    leaveRoom,
    updateOnlineStatus
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;