import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import './HealthAnalytics.css';

const HealthAnalytics = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year, all
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    fetchHealthData();
  }, []);

  useEffect(() => {
    if (healthRecords.length > 0) {
      generateInsights();
    }
  }, [healthRecords, timeRange]);

  const fetchHealthData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

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
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const filterByTimeRange = (records) => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subDays(now, 30);
        break;
      case 'year':
        startDate = subDays(now, 365);
        break;
      default:
        return records;
    }

    return records.filter(r => new Date(r.recordedAt) >= startDate);
  };

  const generateInsights = () => {
    const filtered = filterByTimeRange(healthRecords);
    const newInsights = [];

    // Insight 1: Most tracked metric
    const typeCounts = {};
    filtered.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    const mostTracked = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    if (mostTracked) {
      newInsights.push({
        icon: '📊',
        title: 'Most Tracked Metric',
        value: mostTracked[0].replace('_', ' '),
        detail: `${mostTracked[1]} readings`,
        type: 'info'
      });
    }

    // Insight 2: Abnormal readings
    const abnormal = filtered.filter(r => !r.isNormal);
    if (abnormal.length > 0) {
      newInsights.push({
        icon: '⚠️',
        title: 'Readings Outside Normal Range',
        value: abnormal.length,
        detail: `${Math.round((abnormal.length / filtered.length) * 100)}% of total`,
        type: 'warning'
      });
    }

    // Insight 3: Tracking streak
    const dates = [...new Set(filtered.map(r => new Date(r.recordedAt).toDateString()))];
    newInsights.push({
      icon: '🔥',
      title: 'Active Tracking Days',
      value: dates.length,
      detail: `in the last ${timeRange}`,
      type: 'success'
    });

    // Insight 4: Average daily readings
    const avgDaily = (filtered.length / dates.length).toFixed(1);
    newInsights.push({
      icon: '📈',
      title: 'Average Daily Readings',
      value: avgDaily,
      detail: 'readings per day',
      type: 'info'
    });

    setInsights(newInsights);
  };

  const getMetricDistribution = () => {
    const filtered = filterByTimeRange(healthRecords);
    const distribution = {};
    
    filtered.forEach(r => {
      const type = r.type.replace('_', ' ');
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const getNormalVsAbnormal = () => {
    const filtered = filterByTimeRange(healthRecords);
    const normal = filtered.filter(r => r.isNormal).length;
    const abnormal = filtered.filter(r => !r.isNormal).length;

    return [
      { name: 'Normal', value: normal, color: '#10b981' },
      { name: 'Abnormal', value: abnormal, color: '#ef4444' }
    ];
  };

  const getActivityTrend = () => {
    const filtered = filterByTimeRange(healthRecords);
    const dailyCounts = {};

    filtered.forEach(r => {
      const date = format(new Date(r.recordedAt), 'MM/dd');
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .slice(-14); // Last 14 days
  };

  const getHealthScore = () => {
    const filtered = filterByTimeRange(healthRecords);
    if (filtered.length === 0) return 0;

    const normalCount = filtered.filter(r => r.isNormal).length;
    const trackingConsistency = Math.min((filtered.length / 30) * 100, 100); // Based on 30 readings target
    const normalPercentage = (normalCount / filtered.length) * 100;

    return Math.round((normalPercentage * 0.7) + (trackingConsistency * 0.3));
  };

  const healthScore = getHealthScore();
  const scoreColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : '#ef4444';

  if (loading) {
    return <div className="card">Loading analytics...</div>;
  }

  return (
    <div className="health-analytics">
      <div className="analytics-header">
        <h1>📊 Health Analytics & Insights</h1>
        <p>Comprehensive analysis of your health data</p>
        
        <div className="time-range-selector">
          {['week', 'month', 'year', 'all'].map(range => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' ? 'Last 7 Days' : 
               range === 'month' ? 'Last 30 Days' : 
               range === 'year' ? 'Last Year' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div className="card health-score-card">
        <h3>Overall Health Score</h3>
        <div className="health-score-container">
          <div className="score-circle" style={{ borderColor: scoreColor }}>
            <span className="score-value" style={{ color: scoreColor }}>{healthScore}</span>
            <span className="score-label">/ 100</span>
          </div>
          <div className="score-description">
            <h4 style={{ color: scoreColor }}>
              {healthScore >= 80 ? 'Excellent!' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </h4>
            <p>
              {healthScore >= 80 ? 'Your health metrics are looking great! Keep up the good work.' :
               healthScore >= 60 ? 'You\'re doing well, but there\'s room for improvement.' :
               'Consider consulting with a healthcare provider about your readings.'}
            </p>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="insights-grid">
        {insights.map((insight, idx) => (
          <div key={idx} className={`insight-card insight-${insight.type}`}>
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <div className="insight-value">{insight.value}</div>
              <div className="insight-detail">{insight.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        {/* Activity Trend */}
        <div className="card chart-card">
          <h3>Daily Activity Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getActivityTrend()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Normal vs Abnormal */}
        <div className="card chart-card">
          <h3>Reading Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={getNormalVsAbnormal()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getNormalVsAbnormal().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Distribution */}
      <div className="card">
        <h3>Metric Type Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getMetricDistribution()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#764ba2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="card recommendations-card">
        <h3>💡 Personalized Recommendations</h3>
        <div className="recommendations-list">
          {healthScore < 60 && (
            <div className="recommendation warning">
              <span className="rec-icon">⚠️</span>
              <div>
                <strong>Schedule a check-up</strong>
                <p>Some of your readings are outside the normal range. Consider consulting with a healthcare provider.</p>
              </div>
            </div>
          )}
          {insights[2]?.value < 4 && (
            <div className="recommendation info">
              <span className="rec-icon">📅</span>
              <div>
                <strong>Track more consistently</strong>
                <p>Try to log your health metrics daily for better insights and trend analysis.</p>
              </div>
            </div>
          )}
          <div className="recommendation success">
            <span className="rec-icon">✨</span>
            <div>
              <strong>Keep up the tracking!</strong>
              <p>Regular monitoring helps you stay on top of your health and catch issues early.</p>
            </div>
          </div>
          <div className="recommendation info">
            <span className="rec-icon">📊</span>
            <div>
              <strong>Review your trends</strong>
              <p>Look for patterns in your data to understand what affects your health metrics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalytics;
