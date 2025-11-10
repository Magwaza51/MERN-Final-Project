import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import ThemeSwitcher from '../components/ThemeSwitcher';
import HealthDashboard from '../components/HealthDashboard';
import HealthRecordForm from '../components/HealthRecordForm';
import HealthMetricCard from '../components/HealthMetricCard';

const ThemeDemo = () => {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(true);

  // Mock health data for demo
  const mockHealthRecords = [
    {
      _id: '1',
      type: 'blood_pressure',
      value: { systolic: 120, diastolic: 80 },
      date: new Date().toISOString(),
      isNormal: true,
      notes: 'Normal reading'
    },
    {
      _id: '2',
      type: 'heart_rate',
      value: { level: 75 },
      date: new Date(Date.now() - 86400000).toISOString(),
      isNormal: true,
      notes: 'Resting heart rate'
    },
    {
      _id: '3',
      type: 'blood_sugar',
      value: { level: 95 },
      date: new Date(Date.now() - 172800000).toISOString(),
      isNormal: true,
      notes: 'Fasting glucose'
    }
  ];

  const mockAnalytics = {
    trends: {
      blood_pressure: { trend: 'stable', change: 0 },
      heart_rate: { trend: 'improving', change: -2 },
      weight: { trend: 'stable', change: 0 }
    },
    summary: {
      totalReadings: mockHealthRecords.length,
      normalReadings: mockHealthRecords.filter(r => r.isNormal).length,
      averageFrequency: '3.2 readings/week'
    }
  };

  return (
    <SidebarLayout>
      <div className="theme-demo-container">
        {/* Theme Switcher Section */}
        {showThemeSwitcher && (
          <div className="demo-section">
            <ThemeSwitcher />
            <div className="theme-controls">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowThemeSwitcher(false)}
              >
                Hide Theme Switcher
              </button>
              <p className="theme-note">
                💡 <strong>Note:</strong> Page will reload when switching themes to apply changes
              </p>
            </div>
          </div>
        )}

        {!showThemeSwitcher && (
          <div className="demo-section">
            <button 
              className="btn btn-primary"
              onClick={() => setShowThemeSwitcher(true)}
            >
              🎨 Show Theme Switcher
            </button>
          </div>
        )}

        {/* Quick Metrics Demo */}
        <div className="demo-section">
          <h2 className="section-title">📊 Health Metrics Overview</h2>
          <div className="metrics-grid">
            <HealthMetricCard
              icon="🩺"
              title="Blood Pressure"
              value="120/80"
              unit="mmHg"
              status="normal"
              color="#f44336"
            />
            <HealthMetricCard
              icon="❤️"
              title="Heart Rate"
              value="75"
              unit="bpm"
              status="normal"
              color="#E91E63"
            />
            <HealthMetricCard
              icon="🍯"
              title="Blood Sugar"
              value="95"
              unit="mg/dL"
              status="normal"
              color="#FF9800"
            />
            <HealthMetricCard
              icon="⚖️"
              title="Weight"
              value="70"
              unit="kg"
              status="normal"
              color="#9C27B0"
            />
          </div>
        </div>

        {/* Dashboard Demo */}
        <div className="demo-section">
          <h2 className="section-title">📈 Health Dashboard</h2>
          <HealthDashboard records={mockHealthRecords} analytics={mockAnalytics} />
        </div>

        {/* Feature Cards Demo */}
        <div className="demo-section">
          <h2 className="section-title">🚀 Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Health Assistant</h3>
              <p className="feature-description">
                Get personalized health insights and recommendations powered by artificial intelligence.
              </p>
              <button className="feature-button">Try AI Assistant</button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Smart Appointments</h3>
              <p className="feature-description">
                Book appointments with top specialists and manage your healthcare schedule effortlessly.
              </p>
              <button className="feature-button">Book Appointment</button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3 className="feature-title">Telemedicine</h3>
              <p className="feature-description">
                Connect with healthcare providers remotely through secure video consultations.
              </p>
              <button className="feature-button">Start Consultation</button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚨</div>
              <h3 className="feature-title">Emergency System</h3>
              <p className="feature-description">
                Quick access to emergency services with instant alerts and medical ID sharing.
              </p>
              <button className="feature-button emergency-btn">Emergency Access</button>
            </div>
          </div>
        </div>

        {/* Form Demo */}
        <div className="demo-section">
          <h2 className="section-title">📝 Add Health Record</h2>
          <HealthRecordForm 
            onRecordAdded={() => console.log('Record added in demo mode')}
            onCancel={() => console.log('Cancelled in demo mode')}
          />
        </div>

        {/* Alerts Demo */}
        <div className="demo-section">
          <h2 className="section-title">🔔 Alert System</h2>
          <div className="alerts-demo">
            <div className="alert alert-success">
              ✅ Health record added successfully! Your vitals are looking great.
            </div>
            <div className="alert alert-warning">
              ⚠️ Blood pressure reading is slightly elevated. Consider consulting your doctor.
            </div>
            <div className="alert alert-error">
              ❌ Failed to sync data. Please check your internet connection.
            </div>
          </div>
        </div>

        {/* Theme Info */}
        <div className="demo-section">
          <div className="card">
            <h3>🎨 About These Themes</h3>
            <div className="theme-info-grid">
              <div className="theme-info-card">
                <h4>🌙 Dark Gradient Theme</h4>
                <ul>
                  <li>Modern dark design with purple/blue gradients</li>
                  <li>Glassmorphism cards with blur effects</li>
                  <li>Animated background particles</li>
                  <li>Perfect for nighttime usage</li>
                  <li>Reduces eye strain</li>
                </ul>
              </div>
              <div className="theme-info-card">
                <h4>🏥 Medical Green Theme</h4>
                <ul>
                  <li>Professional medical color scheme</li>
                  <li>Collapsible sidebar navigation</li>
                  <li>Clean light background</li>
                  <li>Organized section-based menu</li>
                  <li>Medical pattern background</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .theme-demo-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .demo-section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-accent, #1a202c);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .alerts-demo {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .theme-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }

        .theme-note {
          margin: 0;
          color: var(--text-secondary, #666);
          font-size: 0.9rem;
        }

        .theme-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .theme-info-card {
          background: var(--bg-tertiary, #f1f8f6);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid var(--primary-gradient, #56ab2f);
        }

        .theme-info-card h4 {
          margin-bottom: 15px;
          font-size: 1.2rem;
          color: var(--text-accent, #1a202c);
        }

        .theme-info-card ul {
          margin: 0;
          padding-left: 20px;
          color: var(--text-secondary, #666);
        }

        .theme-info-card li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .theme-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>
    </SidebarLayout>
  );
};

export default ThemeDemo;