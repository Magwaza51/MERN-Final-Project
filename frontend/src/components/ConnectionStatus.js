import React from 'react';
import { useSocket } from '../context/SocketContext';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const { isConnected, socket } = useSocket();

  if (!socket) return null;

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div className="status-indicator">
        <div className={`status-dot ${isConnected ? 'online' : 'offline'}`}></div>
        <span className="status-text">
          {isConnected ? 'Real-time Connected' : 'Connecting...'}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;