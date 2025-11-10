import React, { useState } from 'react';
import { toast } from 'react-toastify';

const HealthGoals = ({ userId }) => {
  const [goals, setGoals] = useState([
    { id: 1, metric: 'blood_pressure', target: '120/80', current: '125/82', achieved: false },
    { id: 2, metric: 'weight', target: '70 kg', current: '72 kg', achieved: false },
    { id: 3, metric: 'exercise', target: '30 min/day', current: '25 min/day', achieved: false }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    metric: 'blood_pressure',
    target: '',
    description: ''
  });

  const healthMetrics = {
    'blood_pressure': { label: 'Blood Pressure', icon: '🩺', unit: 'mmHg' },
    'blood_sugar': { label: 'Blood Sugar', icon: '🍯', unit: 'mg/dL' },
    'heart_rate': { label: 'Heart Rate', icon: '❤️', unit: 'bpm' },
    'weight': { label: 'Weight', icon: '⚖️', unit: 'kg' },
    'exercise': { label: 'Exercise', icon: '🏃‍♂️', unit: 'min/day' },
    'water_intake': { label: 'Water Intake', icon: '💧', unit: 'L/day' }
  };

  const calculateProgress = (current, target) => {
    // Simplified progress calculation
    return Math.min(Math.round((parseFloat(current) / parseFloat(target)) * 100), 100);
  };

  const addGoal = () => {
    if (!newGoal.target) {
      toast.error('Please enter a target value');
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      current: '0',
      achieved: false
    };

    setGoals([...goals, goal]);
    setNewGoal({ metric: 'blood_pressure', target: '', description: '' });
    setShowAddGoal(false);
    toast.success('Health goal added successfully!');
  };

  const toggleGoalAchieved = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, achieved: !goal.achieved }
        : goal
    ));
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>🎯 Health Goals</h3>
        <button 
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="btn btn-primary"
          style={{ fontSize: '14px' }}
        >
          {showAddGoal ? '❌ Cancel' : '➕ Add Goal'}
        </button>
      </div>

      {showAddGoal && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h4>Add New Health Goal</h4>
          <div className="form-group">
            <label>Health Metric:</label>
            <select
              value={newGoal.metric}
              onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {Object.entries(healthMetrics).map(([key, value]) => (
                <option key={key} value={key}>{value.icon} {value.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Target Value:</label>
            <input
              type="text"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder={`e.g., 120/80 ${healthMetrics[newGoal.metric].unit}`}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div className="form-group">
            <label>Description (optional):</label>
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Goal description..."
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <button onClick={addGoal} className="btn btn-primary">
            Add Goal
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {goals.map((goal) => {
          const metric = healthMetrics[goal.metric];
          const progress = calculateProgress(goal.current, goal.target);
          
          return (
            <div 
              key={goal.id}
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px',
                background: goal.achieved ? '#f0f8f0' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{metric.icon}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{metric.label}</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Target: {goal.target} {metric.unit}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleGoalAchieved(goal.id)}
                  style={{
                    background: goal.achieved ? '#4CAF50' : 'transparent',
                    border: `2px solid ${goal.achieved ? '#4CAF50' : '#ddd'}`,
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {goal.achieved ? '✓' : ''}
                </button>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                  <span>Current: {goal.current} {metric.unit}</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ 
                  background: '#e0e0e0', 
                  borderRadius: '10px', 
                  height: '8px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    background: goal.achieved ? '#4CAF50' : '#2196F3',
                    width: `${Math.min(progress, 100)}%`,
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <p>No health goals set yet. Add your first goal to get started!</p>
        </div>
      )}
    </div>
  );
};

export default HealthGoals;