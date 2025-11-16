import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ProductionHome = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 50000,
    consultations: 250000,
    doctors: 5000,
    emergencyResponses: 10000
  });

  const features = [
    {
      icon: '🤖',
      title: 'AI Health Assistant',
      description: 'Get personalized health advice with our advanced AI assistant. Voice-enabled, symptom analysis, and 24/7 support.',
      path: '/ai-assistant',
      color: '#4f46e5',
      premium: false
    },
    {
      icon: '📹',
      title: 'Telemedicine',
      description: 'Video consultations with certified doctors. HD video, secure messaging, and digital prescriptions.',
      path: '/telemedicine',
      color: '#059669',
      premium: false
    },
    {
      icon: '📋',
      title: 'Digital Medical Records',
      description: 'QR code emergency access, secure cloud storage, and instant sharing with healthcare providers.',
      path: '/medical-records',
      color: '#7c3aed',
      premium: false
    },
    {
      icon: '📅',
      title: 'Smart Appointments',
      description: 'AI-powered scheduling, multiple appointment types, and automated reminders.',
      path: '/advanced-appointments',
      color: '#dc2626',
      premium: false
    },
    {
      icon: '🚨',
      title: 'Emergency Response',
      description: 'One-tap emergency services, location sharing, and medical information broadcasting.',
      path: '/emergency',
      color: '#ea580c',
      premium: false
    },
    {
      icon: '📊',
      title: 'Health Analytics',
      description: 'Real-time health monitoring, trend analysis, and predictive health insights.',
      path: '/dashboard',
      color: '#0891b2',
      premium: false
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      image: '👩‍⚕️',
      text: 'HealthConnect has revolutionized how I interact with patients. The fact that it\'s completely free makes quality healthcare accessible to everyone!'
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      image: '👨',
      text: 'Amazing that such advanced healthcare technology is available for free. The AI assistant helped me understand my symptoms immediately.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Emergency Responder',
      image: '🚑',
      text: 'The emergency QR codes have saved precious time in critical situations. This free platform literally saves lives!'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="production-home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Free Healthcare for Everyone</h1>
              <p>
                Experience next-generation healthcare with AI-powered diagnostics, 
                telemedicine consultations, and emergency response systems - completely free, forever.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{stats.users.toLocaleString()}+</span>
                  <span className="stat-label">Active Users</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{stats.consultations.toLocaleString()}+</span>
                  <span className="stat-label">Consultations</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{stats.doctors.toLocaleString()}+</span>
                  <span className="stat-label">Doctors</span>
                </div>
              </div>
              <div className="hero-actions">
                {isAuthenticated ? (
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-primary hero-btn"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/register')}
                      className="btn btn-primary hero-btn"
                    >
                      Join Free
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="btn btn-secondary hero-btn"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="floating-card">
                <div className="card-header">
                  <span className="card-icon">🤖</span>
                  <span className="card-title">AI Health Assistant</span>
                </div>
                <div className="card-content">
                  <div className="health-metric">
                    <span className="metric-label">Blood Pressure</span>
                    <span className="metric-value normal">120/80</span>
                  </div>
                  <div className="health-metric">
                    <span className="metric-label">Heart Rate</span>
                    <span className="metric-value normal">72 bpm</span>
                  </div>
                  <div className="ai-suggestion">
                    💡 Your health metrics look great! Keep up the good work.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Free Healthcare Features for Everyone</h2>
            <p>Experience the most advanced healthcare platform with cutting-edge technology - no cost, no limits</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate(feature.path)}
                      className="feature-button"
                      style={{ background: feature.color }}
                    >
                      Access Now
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/register')}
                      className="feature-button"
                      style={{ background: feature.color }}
                    >
                      Sign Up Free
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Demo Section */}
      <section className="emergency-demo">
        <div className="container">
          <div className="emergency-content">
            <div className="emergency-text">
              <h2>🚨 Emergency Response System</h2>
              <p>
                In critical situations, every second counts. Our emergency system provides
                instant access to your medical information and contacts emergency services
                with your location and health data.
              </p>
              <div className="emergency-features">
                <div className="emergency-feature">
                  <span className="emergency-icon">📍</span>
                  <span>GPS Location Sharing</span>
                </div>
                <div className="emergency-feature">
                  <span className="emergency-icon">📋</span>
                  <span>Medical Info Broadcasting</span>
                </div>
                <div className="emergency-feature">
                  <span className="emergency-icon">📞</span>
                  <span>Auto Emergency Contacts</span>
                </div>
              </div>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/emergency')}
                  className="emergency-btn"
                >
                  Access Emergency System
                </button>
              ) : (
                <button
                  onClick={() => navigate('/register')}
                  className="emergency-btn"
                >
                  Join Free for Emergency Access
                </button>
              )}
            </div>
            <div className="emergency-visual">
              <div className="emergency-card">
                <div className="emergency-header">
                  <span className="emergency-status">🚨 EMERGENCY ACTIVE</span>
                </div>
                <div className="emergency-info">
                  <div className="emergency-detail">
                    <span>Location:</span>
                    <span>📍 Downtown Medical Center</span>
                  </div>
                  <div className="emergency-detail">
                    <span>Blood Type:</span>
                    <span>🩸 O+</span>
                  </div>
                  <div className="emergency-detail">
                    <span>Allergies:</span>
                    <span>⚠️ Penicillin</span>
                  </div>
                  <div className="emergency-timer">
                    Response Time: <strong>2:34</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied users who trust HealthConnect</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote-icon">💬</div>
                  <p>"{testimonial.text}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.image}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Healthcare Experience?</h2>
            <p>Join the healthcare revolution today with HealthConnect - completely free!</p>
            {!isAuthenticated && (
              <div className="cta-actions">
                <button 
                  onClick={() => navigate('/register')}
                  className="btn btn-primary cta-btn"
                >
                  Join Free Now
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-outline cta-btn"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .production-home {
          min-height: 100vh;
          padding-top: 70px; /* Add padding to prevent navbar overlap */
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0 100px 0; /* Adjusted top padding */
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-text h1 {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-text p {
          font-size: 1.3rem;
          margin-bottom: 40px;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: bold;
          color: #ffd700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
        }

        .hero-btn {
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
          border: 2px solid #4f46e5;
        }

        .btn-primary:hover {
          background: #3730a3;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: white;
          color: #4f46e5;
        }

        .floating-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .card-icon {
          font-size: 2rem;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }

        .health-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .metric-label {
          color: #666;
        }

        .metric-value {
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 15px;
        }

        .metric-value.normal {
          background: #d4edda;
          color: #155724;
        }

        .ai-suggestion {
          margin-top: 15px;
          padding: 15px;
          background: #e7f3ff;
          border-radius: 10px;
          color: #0066cc;
          font-size: 0.9rem;
        }

        .features {
          padding: 100px 0;
          background: #f8f9fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 15px;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #666;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
          position: relative;
          overflow: hidden;
        }

        .feature-card.demo-feature {
          background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
          border: 2px solid #fdcb6e;
          animation: demo-glow 3s ease-in-out infinite;
        }

        @keyframes demo-glow {
          0%, 100% { 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          50% { 
            box-shadow: 0 15px 40px rgba(139, 92, 246, 0.3);
          }
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-card.demo-feature:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(139, 92, 246, 0.4);
        }

        .feature-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .demo-badge {
          background: linear-gradient(135deg, #ff6b6b, #feca57);
          color: white;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .feature-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .demo-feature .feature-description {
          color: #2d3748;
          font-weight: 500;
        }

        .feature-button {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .demo-button {
          background: linear-gradient(135deg, #8b5cf6, #a855f7) !important;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          animation: demo-button-glow 2s ease-in-out infinite;
        }

        @keyframes demo-button-glow {
          0%, 100% { 
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          }
          50% { 
            box-shadow: 0 12px 35px rgba(139, 92, 246, 0.6);
          }
        }

        .feature-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .demo-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 40px rgba(139, 92, 246, 0.7) !important;
        }

        .emergency-demo {
          padding: 100px 0;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
        }

        .emergency-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .emergency-text h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .emergency-text p {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .emergency-features {
          margin-bottom: 40px;
        }

        .emergency-feature {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .emergency-icon {
          font-size: 1.5rem;
        }

        .emergency-btn {
          background: white;
          color: #ee5a24;
          border: none;
          padding: 15px 30px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .emergency-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }

        .emergency-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .emergency-status {
          background: #dc3545;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }

        .emergency-detail {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .emergency-timer {
          text-align: center;
          margin-top: 20px;
          font-size: 1.2rem;
        }

        .testimonials {
          padding: 100px 0;
          background: white;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .testimonial-card {
          background: #f8f9fa;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .quote-icon {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .testimonial-content p {
          font-style: italic;
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .author-avatar {
          font-size: 3rem;
        }

        .author-info h4 {
          margin: 0;
          color: #333;
        }

        .author-info p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .cta {
          padding: 100px 0;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .cta-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-outline:hover {
          background: white;
          color: #4f46e5;
        }

        .cta-btn {
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .production-home {
            padding-top: 60px; /* Adjust for smaller navbar on mobile */
          }

          .hero {
            padding: 60px 0 80px 0;
          }

          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero-text h1 {
            font-size: 2.2rem;
          }

          .hero-text p {
            font-size: 1.1rem;
          }

          .hero-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 25px;
          }

          .stat-number {
            font-size: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-btn {
            width: 100%;
            max-width: 300px;
          }

          .floating-card {
            max-width: 100%;
          }

          .emergency-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .emergency-text h2 {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .section-header p {
            font-size: 1.1rem;
          }

          .cta-content h2 {
            font-size: 2rem;
          }

          .cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .cta-btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .hero-text h1 {
            font-size: 1.8rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .feature-card {
            padding: 30px 20px;
          }

          .feature-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </>
  );
};

export default ProductionHome;