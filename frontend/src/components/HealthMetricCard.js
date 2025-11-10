import React from 'react';

const HealthMetricCard = ({ icon, title, value, unit, status, trend, color }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'danger': return '#f44336';
      default: return '#666';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  return (
    <div className="card" style={{ 
      textAlign: 'center', 
      padding: '20px',
      background: `linear-gradient(135deg, ${color}15, white)`,
      border: `2px solid ${color}30`
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <h4 style={{ margin: '0 0 10px 0', color: color }}>{title}</h4>
      
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
        {value} <span style={{ fontSize: '14px', color: '#666' }}>{unit}</span>
      </div>
      
      <div style={{ 
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '12px',
        backgroundColor: getStatusColor(status),
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: '8px'
      }}>
        {status}
      </div>
      
      {trend !== undefined && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          {getTrendIcon(trend)} {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  );
};

export default HealthMetricCard;