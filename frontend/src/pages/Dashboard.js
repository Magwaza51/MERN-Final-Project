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
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

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
        setLastUpdated(new Date());
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  // Filter and search functionality
  const getFilteredRecords = () => {
    let filtered = healthRecords;
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    // Search by notes
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Pagination logic
  const filteredRecords = getFilteredRecords();
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getTrendArrow = (type) => {
    const typeRecords = healthRecords.filter(r => r.type === type);
    if (typeRecords.length < 2) return '';
    
    const latest = typeRecords[0];
    const previous = typeRecords[1];
    
    let latestValue, previousValue;
    
    if (type === 'blood_pressure') {
      latestValue = latest.value.systolic;
      previousValue = previous.value.systolic;
    } else {
      latestValue = latest.value.level;
      previousValue = previous.value.level;
    }
    
    if (latestValue > previousValue) return ' ↑';
    if (latestValue < previousValue) return ' ↓';
    return ' →';
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
              title={config.title + getTrendArrow(type)}
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
            <HealthDashboard records={filteredRecords} analytics={analytics} />
            {filteredRecords.length > recordsPerPage && (
              <div className="card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    ← Previous
                  </button>
                  <span style={{ padding: '8px 16px', fontWeight: 'bold' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <span style={{ color: '#666' }}>
                    ({indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length})
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
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
            {lastUpdated && (
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? '❌ Cancel' : '➕ Add Reading'}
            </button>
            <button 
              onClick={handleRefresh}
              className="btn btn-secondary"
              disabled={refreshing}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {refreshing ? '↻ Refreshing...' : '🔄 Refresh'}
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

      {/* Search and Filter Bar */}
      {activeTab === 'dashboard' && healthRecords.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <input
                type="text"
                placeholder="🔍 Search records by type or notes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Types</option>
                <option value="blood_pressure">Blood Pressure</option>
                <option value="blood_sugar">Blood Sugar</option>
                <option value="heart_rate">Heart Rate</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
                <option value="oxygen_saturation">Oxygen Saturation</option>
              </select>
            </div>
            <div style={{ color: '#6b7280', fontWeight: '600' }}>
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
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