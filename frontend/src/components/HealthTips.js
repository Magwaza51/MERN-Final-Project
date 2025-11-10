import React, { useState } from 'react';
import { toast } from 'react-toastify';

const HealthTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const healthTips = {
    general: [
      {
        icon: '💧',
        title: 'Stay Hydrated',
        tip: 'Drink at least 8 glasses of water daily to maintain optimal body function.',
        importance: 'high'
      },
      {
        icon: '😴',
        title: 'Quality Sleep',
        tip: 'Aim for 7-9 hours of sleep each night for better mental and physical health.',
        importance: 'high'
      },
      {
        icon: '🚶‍♀️',
        title: 'Daily Movement',
        tip: 'Take at least 10,000 steps daily or exercise for 30 minutes.',
        importance: 'medium'
      },
      {
        icon: '🧘‍♂️',
        title: 'Stress Management',
        tip: 'Practice meditation or deep breathing exercises for 10 minutes daily.',
        importance: 'medium'
      }
    ],
    heart: [
      {
        icon: '❤️',
        title: 'Heart-Healthy Diet',
        tip: 'Include omega-3 rich foods like fish, nuts, and seeds in your diet.',
        importance: 'high'
      },
      {
        icon: '🏃‍♂️',
        title: 'Cardio Exercise',
        tip: 'Engage in aerobic activities for at least 150 minutes per week.',
        importance: 'high'
      },
      {
        icon: '🚭',
        title: 'Avoid Smoking',
        tip: 'Quit smoking to reduce risk of heart disease by up to 50%.',
        importance: 'high'
      }
    ],
    diabetes: [
      {
        icon: '🍎',
        title: 'Blood Sugar Control',
        tip: 'Monitor your blood glucose levels regularly and maintain a food diary.',
        importance: 'high'
      },
      {
        icon: '🥗',
        title: 'Balanced Meals',
        tip: 'Choose complex carbohydrates and pair them with protein and fiber.',
        importance: 'high'
      },
      {
        icon: '⏰',
        title: 'Regular Meal Times',
        tip: 'Eat meals at consistent times to help regulate blood sugar levels.',
        importance: 'medium'
      }
    ],
    mental: [
      {
        icon: '🧠',
        title: 'Mental Wellness',
        tip: 'Practice gratitude journaling to improve mental health and mood.',
        importance: 'medium'
      },
      {
        icon: '👥',
        title: 'Social Connection',
        tip: 'Maintain regular contact with friends and family for emotional support.',
        importance: 'medium'
      },
      {
        icon: '📚',
        title: 'Continuous Learning',
        tip: 'Keep your mind active with reading, puzzles, or learning new skills.',
        importance: 'low'
      }
    ]
  };

  const categories = {
    general: { label: 'General Health', icon: '🌟' },
    heart: { label: 'Heart Health', icon: '❤️' },
    diabetes: { label: 'Diabetes Care', icon: '🩺' },
    mental: { label: 'Mental Health', icon: '🧠' }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const shareTip = (tip) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.tip,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${tip.title}: ${tip.tip}`);
      toast.success('Tip copied to clipboard!');
    }
  };

  return (
    <div className="card">
      <h3>💡 Health Tips & Recommendations</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Evidence-based health tips to support your wellness journey.
      </p>

      {/* Category Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              padding: '8px 16px',
              border: selectedCategory === key ? '2px solid #007bff' : '1px solid #ddd',
              backgroundColor: selectedCategory === key ? '#007bff' : 'white',
              color: selectedCategory === key ? 'white' : '#333',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {/* Tips Display */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {healthTips[selectedCategory].map((tip, index) => (
          <div 
            key={index}
            style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              background: 'white',
              transition: 'box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '24px' }}>{tip.icon}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                    {tip.title}
                  </h4>
                  <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
                    {tip.tip}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: getImportanceColor(tip.importance),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {tip.importance}
                </div>
                <button
                  onClick={() => shareTip(tip)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Share this tip"
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Information */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          🚨 Emergency Information
        </h4>
        <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
          <strong>If you experience severe symptoms:</strong> chest pain, difficulty breathing, 
          severe headache, or loss of consciousness, call emergency services immediately.
        </p>
        <div style={{ marginTop: '10px' }}>
          <strong>Emergency Numbers:</strong> 911 (US), 999 (UK), 112 (EU)
        </div>
      </div>
    </div>
  );
};

export default HealthTips;