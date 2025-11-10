import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <div className="card">
        <h1>🏥 HealthConnect - Smart Healthcare & Appointment Platform</h1>
        <p>
          Your comprehensive healthcare companion supporting <strong>SDG 3: Good Health and Well-Being</strong>. 
          Track your health metrics, find qualified doctors, and book appointments seamlessly.
        </p>
      </div>

      <div className="card">
        <h2>🌟 Revolutionizing Healthcare Access</h2>
        <p>
          HealthConnect bridges the gap between patients and healthcare providers by offering 
          <strong> health monitoring</strong>, <strong>doctor discovery</strong>, and 
          <strong> appointment management</strong> in one unified platform. Supporting 
          Sustainable Development Goal 3, we make quality healthcare accessible to everyone.
        </p>
      </div>
      
      {isAuthenticated ? (
        <div className="card">
          <h3>Welcome back, {user?.name}! 👋</h3>
          <p>Manage your health and schedule appointments with ease.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary">
              📊 Health Dashboard
            </Link>
            <Link to="/doctors" className="btn btn-primary">
              👩‍⚕️ Find Doctors
            </Link>
            <Link to="/appointments" className="btn btn-secondary">
              📅 My Appointments
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3>🚀 Get Started with HealthConnect</h3>
          <p>Join thousands of users taking control of their healthcare journey. Sign up today!</p>
          <div>
            <Link to="/login" className="btn btn-primary" style={{ marginRight: '10px' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>🩺 Health Monitoring</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>📈 Blood Pressure Tracking</li>
            <li>🍯 Blood Sugar Monitoring</li>
            <li>❤️ Heart Rate Analysis</li>
            <li>⚖️ Weight Management</li>
            <li>🌡️ Temperature Logs</li>
            <li>🫁 Oxygen Saturation</li>
          </ul>
        </div>

        <div className="card">
          <h3>👩‍⚕️ Doctor Services</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>� Advanced Doctor Search</li>
            <li>� Location-based Filtering</li>
            <li>⭐ Rating & Reviews System</li>
            <li>�️ Real-time Availability</li>
            <li>� Telemedicine Options</li>
            <li>� Transparent Pricing</li>
          </ul>
        </div>

        <div className="card">
          <h3>📅 Appointment Management</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>⚡ Instant Booking</li>
            <li>📱 In-person & Online Visits</li>
            <li>🔔 Smart Reminders</li>
            <li>💬 Secure Messaging</li>
            <li>📋 Prescription Management</li>
            <li>📊 Appointment History</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>🌍 Supporting Global Health Goals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏥</div>
            <h4>Quality Healthcare</h4>
            <p>Access to qualified medical professionals</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>💡</div>
            <h4>Health Education</h4>
            <p>Evidence-based health tips and insights</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>�</div>
            <h4>Privacy First</h4>
            <p>HIPAA-inspired security standards</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌐</div>
            <h4>Global Access</h4>
            <p>Healthcare connectivity worldwide</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📋 How HealthConnect Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>1️⃣</div>
            <h4>Sign Up</h4>
            <p>Create your secure healthcare account</p>
          </div>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>2️⃣</div>
            <h4>Track Health</h4>
            <p>Monitor vital signs and health metrics</p>
          </div>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>3️⃣</div>
            <h4>Find Doctors</h4>
            <p>Search and connect with specialists</p>
          </div>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>4️⃣</div>
            <h4>Book & Manage</h4>
            <p>Schedule and attend appointments</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3>🚀 Ready to Transform Your Healthcare Experience?</h3>
        <p style={{ opacity: 0.9 }}>
          Join HealthConnect today and experience the future of integrated healthcare management.
          Monitor your health, connect with doctors, and take control of your wellness journey.
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="btn" style={{ 
            background: 'white', 
            color: '#667eea', 
            fontWeight: 'bold',
            border: 'none',
            padding: '12px 24px',
            marginTop: '10px'
          }}>
            Get Started Now →
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;