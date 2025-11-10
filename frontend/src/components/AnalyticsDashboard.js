import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    healthTrends: [],
    appointmentStats: [],
    doctorMetrics: [],
    patientInsights: {}
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Generate mock data for demo
        setAnalyticsData(generateMockData());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const healthTrends = [];
    const appointmentStats = [];
    const now = new Date();
    
    // Generate health trends data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      healthTrends.push({
        date: date.toISOString().split('T')[0],
        bloodPressure: 120 + Math.random() * 20,
        heartRate: 70 + Math.random() * 20,
        weight: 70 + Math.random() * 5,
        bloodSugar: 90 + Math.random() * 30
      });

      appointmentStats.push({
        date: date.toISOString().split('T')[0],
        scheduled: Math.floor(Math.random() * 20) + 5,
        completed: Math.floor(Math.random() * 15) + 3,
        cancelled: Math.floor(Math.random() * 5) + 1
      });
    }

    const doctorMetrics = [
      { name: 'Cardiology', appointments: 45, rating: 4.8, revenue: 15000 },
      { name: 'Neurology', appointments: 38, rating: 4.6, revenue: 12500 },
      { name: 'Orthopedics', appointments: 52, rating: 4.7, revenue: 18200 },
      { name: 'Dermatology', appointments: 29, rating: 4.9, revenue: 9800 },
      { name: 'Pediatrics', appointments: 41, rating: 4.8, revenue: 13600 }
    ];

    const patientInsights = {
      totalPatients: 1247,
      activePatients: 834,
      newPatients: 156,
      satisfactionScore: 4.7,
      averageWaitTime: 12,
      totalRevenue: 125670
    };

    return { healthTrends, appointmentStats, doctorMetrics, patientInsights };
  };

  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('Pressure') || entry.dataKey.includes('Rate') ? ' bpm' : entry.dataKey.includes('Sugar') ? ' mg/dL' : entry.dataKey.includes('weight') ? ' kg' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
          <button 
            className={timeRange === '1y' ? 'active' : ''}
            onClick={() => setTimeRange('1y')}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Patients</h3>
            <p className="metric-value">{analyticsData.patientInsights.totalPatients?.toLocaleString()}</p>
            <span className="metric-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <h3>Active Patients</h3>
            <p className="metric-value">{analyticsData.patientInsights.activePatients?.toLocaleString()}</p>
            <span className="metric-change positive">+8% from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>Satisfaction Score</h3>
            <p className="metric-value">{analyticsData.patientInsights.satisfactionScore}/5.0</p>
            <span className="metric-change positive">+0.2 from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${analyticsData.patientInsights.totalRevenue?.toLocaleString()}</p>
            <span className="metric-change positive">+18% from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>Avg Wait Time</h3>
            <p className="metric-value">{analyticsData.patientInsights.averageWaitTime} min</p>
            <span className="metric-change negative">-3 min from last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🆕</div>
          <div className="metric-content">
            <h3>New Patients</h3>
            <p className="metric-value">{analyticsData.patientInsights.newPatients}</p>
            <span className="metric-change positive">+25% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Health Trends Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>Health Trends Over Time</h2>
            <div className="chart-controls">
              <select defaultValue="bloodPressure">
                <option value="bloodPressure">Blood Pressure</option>
                <option value="heartRate">Heart Rate</option>
                <option value="weight">Weight</option>
                <option value="bloodSugar">Blood Sugar</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.healthTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="bloodPressure" stroke="#1976d2" strokeWidth={2} name="Blood Pressure" />
              <Line type="monotone" dataKey="heartRate" stroke="#4caf50" strokeWidth={2} name="Heart Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Statistics */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>Appointment Statistics</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.appointmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#1976d2" fill="#1976d2" fillOpacity={0.6} name="Scheduled" />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#4caf50" fill="#4caf50" fillOpacity={0.6} name="Completed" />
              <Area type="monotone" dataKey="cancelled" stackId="1" stroke="#f44336" fill="#f44336" fillOpacity={0.6} name="Cancelled" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance Metrics */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>Department Performance</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.doctorMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#1976d2" name="Appointments" />
              <Bar dataKey="revenue" fill="#4caf50" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Distribution Pie Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>Patient Distribution by Department</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.doctorMetrics}
                dataKey="appointments"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {analyticsData.doctorMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="tables-section">
        <div className="table-container">
          <h2>Department Performance Details</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Appointments</th>
                  <th>Rating</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.doctorMetrics.map((dept, index) => (
                  <tr key={index}>
                    <td>{dept.name}</td>
                    <td>{dept.appointments}</td>
                    <td>
                      <div className="rating-cell">
                        <span className="stars">
                          {'★'.repeat(Math.floor(dept.rating))}
                        </span>
                        <span>{dept.rating}</span>
                      </div>
                    </td>
                    <td>${dept.revenue.toLocaleString()}</td>
                    <td>
                      <span className={`growth ${Math.random() > 0.5 ? 'positive' : 'negative'}`}>
                        {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 20) + 1}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h3>Export Data</h3>
        <div className="export-buttons">
          <button className="export-btn pdf">📄 Export as PDF</button>
          <button className="export-btn csv">📊 Export as CSV</button>
          <button className="export-btn excel">📈 Export as Excel</button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;