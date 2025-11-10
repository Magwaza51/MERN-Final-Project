import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const EmergencySystem = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location access denied:', error);
        }
      );
    }

    // Load emergency contacts
    loadEmergencyContacts();
  }, []);

  useEffect(() => {
    let timer;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdownActive && countdown === 0) {
      triggerEmergencyAlert();
    }
    return () => clearTimeout(timer);
  }, [countdownActive, countdown]);

  const loadEmergencyContacts = async () => {
    // Use mock emergency contacts for demo
    setEmergencyContacts([
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        phone: '+1-555-0101',
        relation: 'Primary Doctor',
        priority: 1
      },
      {
        id: 2,
        name: 'Emergency Contact',
        phone: '+1-555-0102',
        relation: 'Family Member',
        priority: 2
      },
      {
        id: 3,
        name: 'Local Emergency Services',
        phone: '911',
        relation: 'Emergency Services',
        priority: 3
      }
    ]);
  };

  const startEmergencyCountdown = () => {
    setCountdownActive(true);
    setCountdown(10);
    toast.warning('Emergency countdown started! Cancel within 10 seconds or emergency services will be contacted.');
  };

  const cancelEmergencyCountdown = () => {
    setCountdownActive(false);
    setCountdown(10);
    toast.info('Emergency countdown cancelled.');
  };

  const triggerEmergencyAlert = async () => {
    setEmergencyActive(true);
    setCountdownActive(false);

    const emergencyData = {
      timestamp: new Date().toISOString(),
      location: userLocation,
      userInfo: {
        name: localStorage.getItem('userName'),
        medicalConditions: [], // Load from user profile
        medications: [], // Load from user profile
        allergies: [] // Load from user profile
      },
      emergencyType: 'medical',
      autoTriggered: true
    };

    try {
      // Simulate emergency alert in demo mode
      console.log('Emergency alert triggered:', emergencyData);
      toast.success('Emergency alert sent to services and contacts!');

      // Notify emergency contacts
      await notifyEmergencyContacts(emergencyData);

      toast.error('Emergency alert sent! Help is on the way.');
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      toast.error('Failed to send emergency alert. Please call emergency services manually.');
    }
  };

  const notifyEmergencyContacts = async (emergencyData) => {
    for (const contact of emergencyContacts) {
      // Simulate contact notification in demo mode
      console.log(`Notifying ${contact.name} (${contact.phone}):`, emergencyData);
      toast.info(`Notified ${contact.name}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const quickEmergencyCall = (serviceType) => {
    const emergencyNumbers = {
      ambulance: '911',
      police: '911',
      fire: '911',
      poison: '1-800-222-1222'
    };

    if (emergencyNumbers[serviceType]) {
      window.open(`tel:${emergencyNumbers[serviceType]}`);
    }
  };

  return (
    <div className="emergency-system">
      <div className="emergency-header">
        <h2>🚨 Emergency Response System</h2>
        <div className="location-status">
          {userLocation ? (
            <span className="location-found">📍 Location: Available</span>
          ) : (
            <span className="location-missing">📍 Location: Not Available</span>
          )}
        </div>
      </div>

      {countdownActive && (
        <div className="emergency-countdown">
          <div className="countdown-display">
            <h3>Emergency Countdown</h3>
            <div className="countdown-number">{countdown}</div>
            <p>Emergency services will be contacted automatically</p>
            <button 
              className="cancel-btn"
              onClick={cancelEmergencyCountdown}
            >
              CANCEL EMERGENCY
            </button>
          </div>
        </div>
      )}

      {emergencyActive && (
        <div className="emergency-active">
          <div className="emergency-status">
            <h3>🚨 EMERGENCY ALERT ACTIVE</h3>
            <p>Emergency services have been notified</p>
            <p>Location: {userLocation ? `${userLocation.latitude}, ${userLocation.longitude}` : 'Unknown'}</p>
            <button onClick={() => setEmergencyActive(false)}>Deactivate Alert</button>
          </div>
        </div>
      )}

      <div className="emergency-controls">
        <div className="emergency-button-section">
          <h3>Emergency Actions</h3>
          <div className="emergency-buttons">
            <button 
              className="emergency-btn panic"
              onClick={startEmergencyCountdown}
              disabled={countdownActive || emergencyActive}
            >
              🚨 PANIC BUTTON
            </button>
            
            <button 
              className="emergency-btn medical"
              onClick={() => quickEmergencyCall('ambulance')}
            >
              🚑 MEDICAL EMERGENCY
            </button>
            
            <button 
              className="emergency-btn fire"
              onClick={() => quickEmergencyCall('fire')}
            >
              🔥 FIRE EMERGENCY
            </button>
            
            <button 
              className="emergency-btn police"
              onClick={() => quickEmergencyCall('police')}
            >
              👮 POLICE
            </button>
          </div>
        </div>

        <div className="quick-call-section">
          <h3>Quick Emergency Calls</h3>
          <div className="quick-calls">
            <button onClick={() => window.open('tel:911')}>
              📞 911 - Emergency Services
            </button>
            <button onClick={() => window.open('tel:1-800-222-1222')}>
              ☠️ Poison Control
            </button>
            <button onClick={() => window.open('tel:988')}>
              🧠 Mental Health Crisis
            </button>
          </div>
        </div>

        <div className="emergency-info-section">
          <h3>Medical Information</h3>
          <div className="medical-info">
            <div className="info-card">
              <h4>Blood Type</h4>
              <p>O+ (Update in Profile)</p>
            </div>
            <div className="info-card">
              <h4>Allergies</h4>
              <p>Penicillin, Nuts (Update in Profile)</p>
            </div>
            <div className="info-card">
              <h4>Emergency Contacts</h4>
              <p>{emergencyContacts.length} contacts configured</p>
            </div>
            <div className="info-card">
              <h4>Medical Conditions</h4>
              <p>Diabetes, Hypertension (Update in Profile)</p>
            </div>
          </div>
        </div>

        <div className="emergency-contacts-section">
          <h3>Emergency Contacts</h3>
          {emergencyContacts.length > 0 ? (
            <div className="contacts-list">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-info">
                    <h4>{contact.name}</h4>
                    <p>{contact.relationship}</p>
                    <p>{contact.phone}</p>
                  </div>
                  <button onClick={() => window.open(`tel:${contact.phone}`)}>
                    📞 Call
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-contacts">
              <p>No emergency contacts configured</p>
              <button>Add Emergency Contact</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .emergency-system {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .emergency-header {
          background: #dc3545;
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
        }

        .location-status {
          margin-top: 10px;
        }

        .location-found {
          color: #d4edda;
        }

        .location-missing {
          color: #f8d7da;
        }

        .emergency-countdown {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(220, 53, 69, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .countdown-display {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 400px;
        }

        .countdown-number {
          font-size: 4rem;
          font-weight: bold;
          color: #dc3545;
          margin: 20px 0;
        }

        .cancel-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .emergency-active {
          background: #dc3545;
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .emergency-controls {
          display: grid;
          gap: 20px;
        }

        .emergency-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .emergency-btn {
          padding: 20px;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .emergency-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .panic {
          background: #dc3545;
          color: white;
        }

        .medical {
          background: #fd7e14;
          color: white;
        }

        .fire {
          background: #e83e8c;
          color: white;
        }

        .police {
          background: #6f42c1;
          color: white;
        }

        .emergency-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .quick-calls {
          display: grid;
          gap: 10px;
          margin-top: 15px;
        }

        .quick-calls button {
          padding: 15px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
        }

        .quick-calls button:hover {
          background: #f8f9fa;
        }

        .medical-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .info-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #4f46e5;
        }

        .info-card h4 {
          margin: 0 0 5px 0;
          color: #4f46e5;
        }

        .info-card p {
          margin: 0;
          color: #666;
        }

        .contacts-list {
          display: grid;
          gap: 15px;
          margin-top: 15px;
        }

        .contact-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .contact-info h4 {
          margin: 0 0 5px 0;
        }

        .contact-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .contact-card button {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        .no-contacts {
          text-align: center;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-top: 15px;
        }

        .no-contacts button {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default EmergencySystem;