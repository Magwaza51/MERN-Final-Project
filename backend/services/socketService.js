const socketService = {
  // Emit notification to specific user
  emitToUser: (userId, eventName, data) => {
    if (global.io) {
      global.io.to(`user_${userId}`).emit(eventName, {
        ...data,
        timestamp: new Date()
      });
    }
  },

  // Emit notification to multiple users
  emitToUsers: (userIds, eventName, data) => {
    if (global.io && Array.isArray(userIds)) {
      userIds.forEach(userId => {
        global.io.to(`user_${userId}`).emit(eventName, {
          ...data,
          timestamp: new Date()
        });
      });
    }
  },

  // Emit to all connected users
  emitToAll: (eventName, data) => {
    if (global.io) {
      global.io.emit(eventName, {
        ...data,
        timestamp: new Date()
      });
    }
  },

  // Appointment related notifications
  notifyAppointmentBooked: (doctorId, patientId, appointmentData) => {
    // Notify doctor
    socketService.emitToUser(doctorId, 'notification', {
      type: 'appointment_booked',
      title: 'New Appointment Scheduled',
      message: `New appointment scheduled with ${appointmentData.patientName}`,
      data: appointmentData,
      priority: 'high'
    });

    // Notify patient
    socketService.emitToUser(patientId, 'notification', {
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${appointmentData.doctorName} has been confirmed`,
      data: appointmentData,
      priority: 'medium'
    });
  },

  notifyAppointmentStatusChange: (userId, status, appointmentData) => {
    const statusMessages = {
      confirmed: 'Your appointment has been confirmed',
      cancelled: 'Your appointment has been cancelled',
      rescheduled: 'Your appointment has been rescheduled',
      completed: 'Your appointment has been completed'
    };

    socketService.emitToUser(userId, 'notification', {
      type: 'appointment_status',
      title: 'Appointment Update',
      message: statusMessages[status] || `Appointment status updated to ${status}`,
      data: appointmentData,
      priority: status === 'cancelled' ? 'high' : 'medium'
    });
  },

  notifyAppointmentReminder: (userId, appointmentData) => {
    socketService.emitToUser(userId, 'notification', {
      type: 'appointment_reminder',
      title: 'Appointment Reminder',
      message: `You have an appointment with Dr. ${appointmentData.doctorName} in 1 hour`,
      data: appointmentData,
      priority: 'high'
    });
  },

  // Health data notifications
  notifyHealthAlert: (userId, healthData) => {
    socketService.emitToUser(userId, 'notification', {
      type: 'health_alert',
      title: 'Health Alert',
      message: `Abnormal reading detected: ${healthData.metric} - ${healthData.value}`,
      data: healthData,
      priority: 'high'
    });
  },

  // General system notifications
  notifySystemMaintenance: (message, scheduledTime) => {
    socketService.emitToAll('notification', {
      type: 'system_maintenance',
      title: 'System Maintenance',
      message: message,
      data: { scheduledTime },
      priority: 'medium'
    });
  },

  // Doctor availability notifications
  notifyDoctorOnline: (doctorId) => {
    socketService.emitToAll('doctor_status', {
      type: 'doctor_online',
      doctorId: doctorId,
      status: 'online'
    });
  },

  notifyDoctorOffline: (doctorId) => {
    socketService.emitToAll('doctor_status', {
      type: 'doctor_offline',
      doctorId: doctorId,
      status: 'offline'
    });
  },

  // Chat and messaging
  sendChatMessage: (senderId, recipientId, message, messageType = 'text') => {
    socketService.emitToUser(recipientId, 'receive_message', {
      senderId: senderId,
      message: message,
      messageType: messageType,
      timestamp: new Date()
    });

    // Also notify about new message
    socketService.emitToUser(recipientId, 'notification', {
      type: 'new_message',
      title: 'New Message',
      message: `You have a new message`,
      data: { senderId, messagePreview: message.substring(0, 50) },
      priority: 'low'
    });
  },

  // Video call notifications
  notifyVideoCallRequest: (fromUserId, toUserId, callData) => {
    socketService.emitToUser(toUserId, 'video_call_request', {
      type: 'incoming_call',
      fromUserId: fromUserId,
      callData: callData
    });
  },

  notifyVideoCallEnded: (userId, callData) => {
    socketService.emitToUser(userId, 'video_call_ended', {
      type: 'call_ended',
      callData: callData
    });
  }
};

module.exports = socketService;