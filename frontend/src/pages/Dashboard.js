import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HealthDashboard from '../components/HealthDashboard';
import HealthRecordForm from '../components/HealthRecordForm';
import HealthMetricCard from '../components/HealthMetricCard';
import HealthGoals from '../components/HealthGoals';
import HealthTips from '../components/HealthTips';
import { exportToCSV, exportToPDF } from '../utils/exportData';
import { DashboardSkeleton } from '../components/LoadingSkeleton';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view your health data');
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'https://mern-final-project-735f.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHealthRecords(data.records || []);
        setError('');
        toast.success(`Loaded ${data.records?.length || 0} health records`);
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        toast.error('Session expired');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        throw new Error('Failed to fetch health data');
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Unable to connect to server. Please check your connection.');
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
    return <DashboardSkeleton />;
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
            <button 
              onClick={() => exportToCSV(healthRecords, `health-records-${new Date().toISOString().split('T')[0]}.csv`)}
              className="btn btn-secondary"
              disabled={healthRecords.length === 0}
              title="Export data to CSV file"
            >
              📄 Export CSV
            </button>
            <button 
              onClick={() => exportToPDF(healthRecords, user?.name || 'User')}
              className="btn btn-secondary"
              disabled={healthRecords.length === 0}
              title="Generate printable PDF report"
            >
              🖨️ Print Report
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