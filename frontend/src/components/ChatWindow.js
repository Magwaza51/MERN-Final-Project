import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import './ChatWindow.css';

const ChatWindow = ({ recipientId, recipientName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket, sendMessage } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('receive_message', (messageData) => {
        if (messageData.senderId === recipientId) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            senderId: messageData.senderId,
            message: messageData.message,
            timestamp: messageData.timestamp,
            messageType: messageData.messageType || 'text'
          }]);
        }
      });

      // Listen for typing indicators
      socket.on('user_typing', (data) => {
        if (data.userId === recipientId) {
          setIsRecipientTyping(data.isTyping);
        }
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
      };
    }
  }, [socket, recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        id: Date.now(),
        senderId: user._id,
        message: newMessage.trim(),
        timestamp: new Date(),
        messageType: 'text'
      };

      // Add to local messages
      setMessages(prev => [...prev, messageData]);

      // Send via socket
      sendMessage(recipientId, newMessage.trim());

      setNewMessage('');
      stopTyping();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!typing && socket) {
      setTyping(true);
      socket.emit('typing_start', { userId: user._id, recipientId });
    }

    // Clear typing after 1 second of no typing
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (typing && socket) {
      setTyping(false);
      socket.emit('typing_stop', { userId: user._id, recipientId });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sendQuickReply = (message) => {
    if (socket) {
      const messageData = {
        id: Date.now(),
        senderId: user._id,
        message: message,
        timestamp: new Date(),
        messageType: 'quick_reply'
      };

      setMessages(prev => [...prev, messageData]);
      sendMessage(recipientId, message, 'quick_reply');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-recipient">
          <div className="recipient-avatar">
            {recipientName.charAt(0).toUpperCase()}
          </div>
          <div className="recipient-info">
            <h3>{recipientName}</h3>
            <span className="status online">Online</span>
          </div>
        </div>
        <div className="chat-controls">
          <button className="video-call-btn" title="Start Video Call">
            📹
          </button>
          <button className="close-chat-btn" onClick={onClose} title="Close Chat">
            ✖️
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Start a conversation with {recipientName}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.senderId === user._id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.message}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))
        )}
        
        {isRecipientTyping && (
          <div className="typing-indicator">
            <div className="typing-content">
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="typing-text">{recipientName} is typing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-replies">
        <button 
          className="quick-reply-btn"
          onClick={() => sendQuickReply('Thank you!')}
        >
          Thank you! 👍
        </button>
        <button 
          className="quick-reply-btn"
          onClick={() => sendQuickReply('Yes, that works for me')}
        >
          Yes ✅
        </button>
        <button 
          className="quick-reply-btn"
          onClick={() => sendQuickReply('Can we reschedule?')}
        >
          Reschedule? 📅
        </button>
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder={`Message ${recipientName}...`}
            className="chat-input"
            autoFocus
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim()}
          >
            Send 📤
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;