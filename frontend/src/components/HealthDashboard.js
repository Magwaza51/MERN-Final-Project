import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const HealthDashboard = ({ records = [], analytics }) => {
  // Ensure records is an array
  const safeRecords = Array.isArray(records) ? records : [];

  // Format data for charts
  const formatChartData = (records, type) => {
    return records
      .filter(record => record && record.type === type)
      .map(record => {
        const date = new Date(record.recordedAt);
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date found in record:', record.recordedAt);
          return null;
        }
        return {
          date: format(date, 'MM/dd'),
          ...record.value,
          isNormal: record.isNormal
        };
      })
      .filter(item => item !== null) // Remove invalid entries
      .slice(-30); // Last 30 readings
  };

  const getStatusColor = (isNormal) => isNormal ? '#4CAF50' : '#f44336';

  const renderBloodPressureChart = () => {
    const bpData = formatChartData(safeRecords, 'blood_pressure');
    if (bpData.length === 0) return null;

    return (
      <div className="card">
        <h4>Blood Pressure Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bpData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="systolic" stroke="#FF6B6B" name="Systolic" strokeWidth={2} />
            <Line type="monotone" dataKey="diastolic" stroke="#4ECDC4" name="Diastolic" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <p>Normal Range: Systolic &lt; 120, Diastolic &lt; 80 mmHg</p>
        </div>
      </div>
    );
  };

  const renderMetricChart = (type, label, color, normalRange) => {
    const data = formatChartData(safeRecords, type);
    if (data.length === 0) return null;

    return (
      <div className="card">
        <h4>{label} Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke={color} 
              strokeWidth={2}
              dot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
        {normalRange && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <p>Normal Range: {normalRange}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSummaryCards = () => {
    if (!analytics) return null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {Object.entries(analytics).map(([type, data]) => {
          const totalReadings = data.normalCount + data.abnormalCount;
          const normalPercentage = totalReadings > 0 ? Math.round((data.normalCount / totalReadings) * 100) : 0;
          
          return (
            <div key={type} className="card" style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 10px 0', textTransform: 'capitalize' }}>
                {type.replace('_', ' ')}
              </h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: normalPercentage >= 80 ? '#4CAF50' : '#f44336' }}>
                {normalPercentage}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Normal Readings</div>
              <div style={{ marginTop: '10px', fontSize: '12px' }}>
                <div>Total: {totalReadings} readings</div>
                <div style={{ color: '#4CAF50' }}>Normal: {data.normalCount}</div>
                <div style={{ color: '#f44336' }}>Needs Attention: {data.abnormalCount}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRecentReadings = () => {
    const recentRecords = safeRecords
      .filter(record => record && record.recordedAt) // Filter out invalid records
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
      .slice(0, 10);

    if (recentRecords.length === 0) {
      return (
        <div className="card">
          <h4>Recent Readings</h4>
          <p>No health records found. Add your first reading to get started!</p>
        </div>
      );
    }

    return (
      <div className="card">
        <h4>Recent Readings</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Value</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {(() => {
                      const date = new Date(record.recordedAt);
                      if (isNaN(date.getTime())) {
                        return 'Invalid Date';
                      }
                      return format(date, 'MMM dd, yyyy HH:mm');
                    })()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textTransform: 'capitalize' }}>
                    {record.type.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {record.type === 'blood_pressure' 
                      ? `${record.value.systolic}/${record.value.diastolic} ${record.value.unit}`
                      : `${record.value.level} ${record.value.unit}`
                    }
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      color: getStatusColor(record.isNormal),
                      fontWeight: 'bold'
                    }}>
                      {record.isNormal ? '✓ Normal' : '⚠ Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <h2>Health Dashboard</h2>
        <p>Track your health metrics and visualize trends over time.</p>
      </div>

      {renderSummaryCards()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {renderBloodPressureChart()}
        {renderMetricChart('blood_sugar', 'Blood Sugar', '#FF9800', '70-99 mg/dL (fasting)')}
        {renderMetricChart('heart_rate', 'Heart Rate', '#E91E63', '60-100 bpm (resting)')}
        {renderMetricChart('weight', 'Weight', '#9C27B0', 'Varies by individual')}
        {renderMetricChart('temperature', 'Temperature', '#F44336', '36.1-37.2°C')}
        {renderMetricChart('oxygen_saturation', 'Oxygen Saturation', '#2196F3', '95-100%')}
      </div>

      {renderRecentReadings()}
    </div>
  );
};

export default HealthDashboard;