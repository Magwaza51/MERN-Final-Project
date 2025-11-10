import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const TelemedicineConsultation = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [doctorInfo, setDoctorInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL);
    
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('doctor-joined', (doctor) => {
      setDoctorInfo(doctor);
      setConsultationStarted(true);
    });

    socket.on('consultation-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (messageInput.trim()) {
      const message = {
        id: Date.now(),
        sender: 'patient',
        text: messageInput,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      setMessageInput('');
      
      // Send to doctor via socket
      // socket.emit('patient-message', message);
    }
  };

  return (
    <div className="telemedicine-container">
      <div className="consultation-header">
        <h2>Telemedicine Consultation</h2>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </div>

      {!consultationStarted ? (
        <div className="waiting-room">
          <div className="waiting-content">
            <div className="doctor-avatar">👨‍⚕️</div>
            <h3>Waiting for Doctor</h3>
            <p>Please wait while we connect you with a healthcare professional.</p>
            <div className="loading-spinner"></div>
            
            <div className="pre-consultation-form">
              <h4>While you wait, please provide:</h4>
              <div className="form-group">
                <label>Chief Complaint:</label>
                <textarea 
                  placeholder="What brings you in today?"
                  className="complaint-input"
                />
              </div>
              <div className="form-group">
                <label>Current Symptoms:</label>
                <textarea 
                  placeholder="Describe your symptoms in detail"
                  className="symptoms-input"
                />
              </div>
              <div className="form-group">
                <label>Pain Level (1-10):</label>
                <input type="range" min="1" max="10" className="pain-slider" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="consultation-active">
          <div className="doctor-info">
            <div className="doctor-avatar">👨‍⚕️</div>
            <div className="doctor-details">
              <h4>Dr. {doctorInfo?.name || 'Healthcare Provider'}</h4>
              <p>{doctorInfo?.specialty || 'General Medicine'}</p>
              <span className="online-status">🟢 Online</span>
            </div>
          </div>

          <div className="video-section">
            <div className="video-container">
              <div className="doctor-video">
                <div className="video-placeholder">
                  <span>Doctor Video</span>
                </div>
              </div>
              <div className="patient-video">
                <div className="video-placeholder">
                  <span>Your Video</span>
                </div>
              </div>
            </div>
            
            <div className="video-controls">
              <button className="control-btn camera">📹</button>
              <button className="control-btn microphone">🎤</button>
              <button className="control-btn screen-share">📺</button>
              <button className="control-btn end-call" onClick={() => navigate('/dashboard')}>
                📞 End Call
              </button>
            </div>
          </div>

          <div className="chat-section">
            <div className="chat-messages">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>

          <div className="consultation-tools">
            <h4>Consultation Tools</h4>
            <div className="tools-grid">
              <button className="tool-btn">📋 Digital Prescription</button>
              <button className="tool-btn">🩺 Vital Signs Review</button>
              <button className="tool-btn">📊 Health Records</button>
              <button className="tool-btn">📅 Follow-up Appointment</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .telemedicine-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .consultation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .status-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
        }

        .connected {
          background: #d4edda;
          color: #155724;
        }

        .disconnected {
          background: #f8d7da;
          color: #721c24;
        }

        .waiting-room {
          background: white;
          border-radius: 10px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .doctor-avatar {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pre-consultation-form {
          max-width: 500px;
          margin: 30px auto;
          text-align: left;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .complaint-input, .symptoms-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          min-height: 80px;
          resize: vertical;
        }

        .pain-slider {
          width: 100%;
        }

        .consultation-active {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          height: calc(100vh - 140px);
        }

        .doctor-info {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .video-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .video-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .video-placeholder {
          background: #000;
          color: white;
          padding: 100px 20px;
          text-align: center;
          border-radius: 10px;
        }

        .video-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .control-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 50px;
          background: #4f46e5;
          color: white;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .end-call {
          background: #dc3545;
        }

        .chat-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 400px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 15px;
        }

        .message {
          margin-bottom: 10px;
        }

        .message.patient .message-content {
          background: #4f46e5;
          color: white;
          margin-left: auto;
          max-width: 80%;
        }

        .message.doctor .message-content {
          background: #e9ecef;
          color: #333;
          max-width: 80%;
        }

        .message-content {
          padding: 10px 15px;
          border-radius: 15px;
        }

        .message-time {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .chat-input {
          display: flex;
          gap: 10px;
        }

        .chat-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 20px;
        }

        .chat-input button {
          padding: 10px 20px;
          border: none;
          background: #4f46e5;
          color: white;
          border-radius: 20px;
          cursor: pointer;
        }

        .consultation-tools {
          background: white;
          border-radius: 10px;
          padding: 20px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 15px;
        }

        .tool-btn {
          padding: 15px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tool-btn:hover {
          background: #f8f9fa;
          border-color: #4f46e5;
        }
      `}</style>
    </div>
  );
};

export default TelemedicineConsultation;