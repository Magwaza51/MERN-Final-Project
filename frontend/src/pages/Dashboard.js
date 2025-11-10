import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import HealthDashboard from '../components/HealthDashboard';
import HealthRecordForm from '../components/HealthRecordForm';
import HealthMetricCard from '../components/HealthMetricCard';
import HealthGoals from '../components/HealthGoals';
import HealthTips from '../components/HealthTips';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [healthRecords, setHealthRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      // Mock health records for demo
      const mockRecords = [
        {
          _id: '1',
          type: 'blood_pressure',
          value: { systolic: 120, diastolic: 80, unit: 'mmHg' },
          recordedAt: new Date().toISOString(),
          isNormal: true,
          notes: 'Normal reading'
        },
        {
          _id: '2',
          type: 'heart_rate',
          value: { level: 75, unit: 'bpm' },
          recordedAt: new Date(Date.now() - 86400000).toISOString(),
          isNormal: true,
          notes: 'Resting heart rate'
        },
        {
          _id: '3',
          type: 'blood_sugar',
          value: { level: 95, unit: 'mg/dL' },
          recordedAt: new Date(Date.now() - 172800000).toISOString(),
          isNormal: true,
          notes: 'Fasting glucose'
        },
        {
          _id: '4',
          type: 'weight',
          value: { level: 70, unit: 'kg' },
          recordedAt: new Date(Date.now() - 259200000).toISOString(),
          isNormal: true,
          notes: 'Weekly weigh-in'
        },
        {
          _id: '5',
          type: 'temperature',
          value: { level: 36.8, unit: '°C' },
          recordedAt: new Date(Date.now() - 345600000).toISOString(),
          isNormal: true,
          notes: 'Normal body temperature'
        },
        {
          _id: '6',
          type: 'oxygen_saturation',
          value: { level: 98, unit: '%' },
          recordedAt: new Date(Date.now() - 432000000).toISOString(),
          isNormal: true,
          notes: 'Excellent oxygen levels'
        },
        // Additional historical data for better charts
        {
          _id: '7',
          type: 'blood_pressure',
          value: { systolic: 118, diastolic: 78, unit: 'mmHg' },
          recordedAt: new Date(Date.now() - 518400000).toISOString(),
          isNormal: true,
          notes: 'Good reading'
        },
        {
          _id: '8',
          type: 'heart_rate',
          value: { level: 72, unit: 'bpm' },
          recordedAt: new Date(Date.now() - 604800000).toISOString(),
          isNormal: true,
          notes: 'Resting rate'
        },
        {
          _id: '9',
          type: 'blood_sugar',
          value: { level: 88, unit: 'mg/dL' },
          recordedAt: new Date(Date.now() - 691200000).toISOString(),
          isNormal: true,
          notes: 'Excellent fasting glucose'
        },
        {
          _id: '10',
          type: 'weight',
          value: { level: 70.5, unit: 'kg' },
          recordedAt: new Date(Date.now() - 777600000).toISOString(),
          isNormal: true,
          notes: 'Weight maintenance'
        }
      ];

      // Mock analytics data
      const mockAnalytics = {
        blood_pressure: {
          normalCount: mockRecords.filter(r => r.type === 'blood_pressure' && r.isNormal).length,
          abnormalCount: mockRecords.filter(r => r.type === 'blood_pressure' && !r.isNormal).length
        },
        heart_rate: {
          normalCount: mockRecords.filter(r => r.type === 'heart_rate' && r.isNormal).length,
          abnormalCount: mockRecords.filter(r => r.type === 'heart_rate' && !r.isNormal).length
        },
        blood_sugar: {
          normalCount: mockRecords.filter(r => r.type === 'blood_sugar' && r.isNormal).length,
          abnormalCount: mockRecords.filter(r => r.type === 'blood_sugar' && !r.isNormal).length
        },
        weight: {
          normalCount: mockRecords.filter(r => r.type === 'weight' && r.isNormal).length,
          abnormalCount: mockRecords.filter(r => r.type === 'weight' && !r.isNormal).length
        },
        temperature: {
          normalCount: mockRecords.filter(r => r.type === 'temperature' && r.isNormal).length,
          abnormalCount: mockRecords.filter(r => r.type === 'temperature' && !r.isNormal).length
        },
        oxygen_saturation: {
          normalCount: mockRecords.filter(r => r.type === 'oxygen_saturation' && r.isNormal).length,
          abnormalCount: mockRecords.filter(r => r.type === 'oxygen_saturation' && !r.isNormal).length
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHealthRecords(mockRecords);
      setAnalytics(mockAnalytics);
      setError('');
      console.log('Running in demo mode - using mock health data');
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Failed to load health data');
      toast.error('Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAdded = () => {
    setShowAddForm(false);
    fetchHealthData(); // Refresh data
  };

  const getLatestMetrics = () => {
    const latest = {};
    const types = ['blood_pressure', 'blood_sugar', 'heart_rate', 'weight', 'temperature', 'oxygen_saturation'];
    
    types.forEach(type => {
      const records = healthRecords.filter(r => r.type === type);
      if (records.length > 0) {
        latest[type] = records[0]; // Already sorted by date DESC
      }
    });
    
    return latest;
  };

  const renderQuickMetrics = () => {
    const latestMetrics = getLatestMetrics();
    
    const metricConfig = {
      blood_pressure: { icon: '🩺', title: 'Blood Pressure', color: '#f44336', unit: 'mmHg' },
      blood_sugar: { icon: '🍯', title: 'Blood Sugar', color: '#FF9800', unit: 'mg/dL' },
      heart_rate: { icon: '❤️', title: 'Heart Rate', color: '#E91E63', unit: 'bpm' },
      weight: { icon: '⚖️', title: 'Weight', color: '#9C27B0', unit: 'kg' },
      temperature: { icon: '🌡️', title: 'Temperature', color: '#F44336', unit: '°C' },
      oxygen_saturation: { icon: '🫁', title: 'Oxygen Sat', color: '#2196F3', unit: '%' }
    };

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        {Object.entries(metricConfig).map(([type, config]) => {
          const record = latestMetrics[type];
          let value = 'No data';
          let status = 'normal';
          
          if (record) {
            if (type === 'blood_pressure') {
              value = `${record.value.systolic}/${record.value.diastolic}`;
            } else {
              value = record.value.level;
            }
            status = record.isNormal ? 'normal' : 'warning';
          }
          
          return (
            <HealthMetricCard
              key={type}
              icon={config.icon}
              title={config.title}
              value={value}
              unit={config.unit}
              status={status}
              color={config.color}
            />
          );
        })}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {renderQuickMetrics()}
            <HealthDashboard records={healthRecords} analytics={analytics} />
          </>
        );
      case 'goals':
        return <HealthGoals userId={user?._id} />;
      case 'tips':
        return <HealthTips />;
      default:
        return renderQuickMetrics();
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Loading your health dashboard...</h2>
        <p>Please wait while we fetch your health data.</p>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'goals', label: 'Health Goals', icon: '🎯' },
    { key: 'tips', label: 'Health Tips', icon: '💡' }
  ];

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1>🏥 HealthConnect - Free Dashboard</h1>
            <p>Welcome back, <strong>{user?.name}</strong>! Enjoy all premium features completely free.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? '❌ Cancel' : '➕ Add Reading'}
            </button>
            <button 
              onClick={fetchHealthData}
              className="btn btn-secondary"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-error" style={{ marginTop: '15px' }}>
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '20px',
          borderBottom: '1px solid #ddd',
          paddingBottom: '10px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: activeTab === tab.key ? '#007bff' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#007bff',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {showAddForm && (
        <HealthRecordForm 
          onRecordAdded={handleRecordAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {renderTabContent()}

      <div className="card">
        <h3>👤 Profile Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Name:</strong> {user?.name}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Total Records:</strong> {healthRecords.length}
          </div>
          <div>
            <strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={logout} 
            className="btn btn-secondary"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;