import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './WellnessTracker.css';

const WellnessTracker = () => {
  const [activeTab, setActiveTab] = useState('water');
  const [waterIntake, setWaterIntake] = useState({ today: 0, goal: 2000, logs: [] });
  const [sleepData, setSleepData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showMoodForm, setShowMoodForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const water = localStorage.getItem('waterIntake');
    const sleep = localStorage.getItem('sleepData');
    const exercise = localStorage.getItem('exerciseData');
    const mood = localStorage.getItem('moodData');

    if (water) setWaterIntake(JSON.parse(water));
    if (sleep) setSleepData(JSON.parse(sleep));
    if (exercise) setExerciseData(JSON.parse(exercise));
    if (mood) setMoodData(JSON.parse(mood));
  };

  // Water Intake Functions
  const addWater = (amount) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog = {
      amount,
      time: new Date().toISOString(),
      date: today
    };
    
    const todayLogs = [...waterIntake.logs.filter(log => log.date === today), newLog];
    const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0);
    
    const updated = {
      ...waterIntake,
      today: todayTotal,
      logs: [...waterIntake.logs, newLog]
    };
    
    setWaterIntake(updated);
    localStorage.setItem('waterIntake', JSON.stringify(updated));
    toast.success(`💧 Added ${amount}ml water`);
    
    if (todayTotal >= waterIntake.goal) {
      toast.success('🎉 Daily water goal achieved!');
    }
  };

  const updateWaterGoal = (newGoal) => {
    const updated = { ...waterIntake, goal: newGoal };
    setWaterIntake(updated);
    localStorage.setItem('waterIntake', JSON.stringify(updated));
    toast.success('Water goal updated');
  };

  // Sleep Tracking Functions
  const addSleep = (sleepEntry) => {
    const newEntry = {
      ...sleepEntry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    const updated = [...sleepData, newEntry];
    setSleepData(updated);
    localStorage.setItem('sleepData', JSON.stringify(updated));
    toast.success('😴 Sleep logged successfully');
    setShowSleepForm(false);
  };

  // Exercise Tracking Functions
  const addExercise = (exerciseEntry) => {
    const newEntry = {
      ...exerciseEntry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    const updated = [...exerciseData, newEntry];
    setExerciseData(updated);
    localStorage.setItem('exerciseData', JSON.stringify(updated));
    toast.success('💪 Exercise logged successfully');
    setShowExerciseForm(false);
  };

  // Mood Tracking Functions
  const addMood = (moodEntry) => {
    const newEntry = {
      ...moodEntry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    const updated = [...moodData, newEntry];
    setMoodData(updated);
    localStorage.setItem('moodData', JSON.stringify(updated));
    toast.success('😊 Mood logged successfully');
    setShowMoodForm(false);
  };

  const deleteEntry = (type, id) => {
    if (type === 'sleep') {
      const updated = sleepData.filter(e => e.id !== id);
      setSleepData(updated);
      localStorage.setItem('sleepData', JSON.stringify(updated));
    } else if (type === 'exercise') {
      const updated = exerciseData.filter(e => e.id !== id);
      setExerciseData(updated);
      localStorage.setItem('exerciseData', JSON.stringify(updated));
    } else if (type === 'mood') {
      const updated = moodData.filter(e => e.id !== id);
      setMoodData(updated);
      localStorage.setItem('moodData', JSON.stringify(updated));
    }
    toast.success('Entry deleted');
  };

  const tabs = [
    { id: 'water', label: '💧 Water', icon: '💧' },
    { id: 'sleep', label: '😴 Sleep', icon: '😴' },
    { id: 'exercise', label: '💪 Exercise', icon: '💪' },
    { id: 'mood', label: '😊 Mood', icon: '😊' }
  ];

  return (
    <div className="wellness-tracker">
      <div className="page-header">
        <h1>🌟 Wellness Tracker</h1>
        <p>Track your daily wellness activities</p>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Water Intake Tab */}
      {activeTab === 'water' && (
        <div className="tab-content">
          <div className="water-container">
            <div className="card water-goal-card">
              <h3>💧 Today's Water Intake</h3>
              <div className="water-progress">
                <div className="water-glass">
                  <div 
                    className="water-level" 
                    style={{ height: `${Math.min((waterIntake.today / waterIntake.goal) * 100, 100)}%` }}
                  >
                    <span className="water-amount">{waterIntake.today}ml</span>
                  </div>
                </div>
                <div className="water-stats">
                  <p><strong>Goal:</strong> {waterIntake.goal}ml</p>
                  <p><strong>Remaining:</strong> {Math.max(waterIntake.goal - waterIntake.today, 0)}ml</p>
                  <p><strong>Progress:</strong> {Math.round((waterIntake.today / waterIntake.goal) * 100)}%</p>
                </div>
              </div>
              
              <div className="quick-add-buttons">
                <button onClick={() => addWater(250)} className="btn btn-water">+250ml</button>
                <button onClick={() => addWater(500)} className="btn btn-water">+500ml</button>
                <button onClick={() => addWater(750)} className="btn btn-water">+750ml</button>
                <button onClick={() => addWater(1000)} className="btn btn-water">+1L</button>
              </div>

              <div className="goal-setter">
                <label>Daily Goal (ml):</label>
                <input
                  type="number"
                  value={waterIntake.goal}
                  onChange={(e) => updateWaterGoal(Number(e.target.value))}
                  step="100"
                  min="1000"
                  max="5000"
                />
              </div>
            </div>

            <div className="card water-history">
              <h3>📊 Today's Log</h3>
              {waterIntake.logs.filter(log => log.date === new Date().toISOString().split('T')[0]).length === 0 ? (
                <p className="empty-message">No water logged today</p>
              ) : (
                <div className="log-list">
                  {waterIntake.logs
                    .filter(log => log.date === new Date().toISOString().split('T')[0])
                    .reverse()
                    .map((log, idx) => (
                      <div key={idx} className="log-item">
                        <span>{new Date(log.time).toLocaleTimeString()}</span>
                        <span className="log-amount">{log.amount}ml</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sleep Tab */}
      {activeTab === 'sleep' && (
        <div className="tab-content">
          <button className="btn btn-primary" onClick={() => setShowSleepForm(!showSleepForm)}>
            {showSleepForm ? '✕ Cancel' : '➕ Log Sleep'}
          </button>

          {showSleepForm && (
            <SleepForm onSubmit={addSleep} onCancel={() => setShowSleepForm(false)} />
          )}

          <div className="entries-grid">
            {sleepData.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">😴</div>
                <h3>No sleep data logged</h3>
                <p>Start tracking your sleep quality</p>
              </div>
            ) : (
              sleepData.slice().reverse().map(entry => (
                <div key={entry.id} className="entry-card sleep-card">
                  <div className="entry-header">
                    <h4>{new Date(entry.date).toLocaleDateString()}</h4>
                    <button onClick={() => deleteEntry('sleep', entry.id)} className="btn-delete">🗑️</button>
                  </div>
                  <div className="entry-content">
                    <p><strong>Hours:</strong> {entry.hours} hours</p>
                    <p><strong>Quality:</strong> {getQualityEmoji(entry.quality)} {entry.quality}/5</p>
                    <p><strong>Bedtime:</strong> {entry.bedtime}</p>
                    <p><strong>Wake time:</strong> {entry.wakeTime}</p>
                    {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Exercise Tab */}
      {activeTab === 'exercise' && (
        <div className="tab-content">
          <button className="btn btn-primary" onClick={() => setShowExerciseForm(!showExerciseForm)}>
            {showExerciseForm ? '✕ Cancel' : '➕ Log Exercise'}
          </button>

          {showExerciseForm && (
            <ExerciseForm onSubmit={addExercise} onCancel={() => setShowExerciseForm(false)} />
          )}

          <div className="entries-grid">
            {exerciseData.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💪</div>
                <h3>No exercise logged</h3>
                <p>Start tracking your workouts</p>
              </div>
            ) : (
              exerciseData.slice().reverse().map(entry => (
                <div key={entry.id} className="entry-card exercise-card">
                  <div className="entry-header">
                    <h4>{entry.type}</h4>
                    <button onClick={() => deleteEntry('exercise', entry.id)} className="btn-delete">🗑️</button>
                  </div>
                  <div className="entry-content">
                    <p><strong>Duration:</strong> {entry.duration} minutes</p>
                    <p><strong>Intensity:</strong> {entry.intensity}</p>
                    <p><strong>Calories:</strong> {entry.calories || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                    {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mood Tab */}
      {activeTab === 'mood' && (
        <div className="tab-content">
          <button className="btn btn-primary" onClick={() => setShowMoodForm(!showMoodForm)}>
            {showMoodForm ? '✕ Cancel' : '➕ Log Mood'}
          </button>

          {showMoodForm && (
            <MoodForm onSubmit={addMood} onCancel={() => setShowMoodForm(false)} />
          )}

          <div className="entries-grid mood-grid">
            {moodData.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">😊</div>
                <h3>No mood entries</h3>
                <p>Start tracking your mental wellbeing</p>
              </div>
            ) : (
              moodData.slice().reverse().map(entry => (
                <div key={entry.id} className={`entry-card mood-card mood-${entry.mood}`}>
                  <div className="entry-header">
                    <h4>{getMoodEmoji(entry.mood)} {entry.mood}</h4>
                    <button onClick={() => deleteEntry('mood', entry.id)} className="btn-delete">🗑️</button>
                  </div>
                  <div className="entry-content">
                    <p><strong>Energy:</strong> {entry.energy}/5</p>
                    <p><strong>Stress:</strong> {entry.stress}/5</p>
                    <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                    {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const SleepForm = ({ onSubmit, onCancel }) => {
  const [data, setData] = useState({
    hours: '',
    quality: 3,
    bedtime: '',
    wakeTime: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="card form-card">
      <h3>Log Sleep</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Hours Slept *</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={data.hours}
              onChange={(e) => setData({ ...data, hours: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Quality (1-5) *</label>
            <select value={data.quality} onChange={(e) => setData({ ...data, quality: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Bedtime</label>
            <input type="time" value={data.bedtime} onChange={(e) => setData({ ...data, bedtime: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Wake Time</label>
            <input type="time" value={data.wakeTime} onChange={(e) => setData({ ...data, wakeTime: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} rows="3" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

const ExerciseForm = ({ onSubmit, onCancel }) => {
  const [data, setData] = useState({
    type: 'Running',
    duration: '',
    intensity: 'Moderate',
    calories: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="card form-card">
      <h3>Log Exercise</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Exercise Type *</label>
            <select value={data.type} onChange={(e) => setData({ ...data, type: e.target.value })}>
              <option>Running</option>
              <option>Walking</option>
              <option>Cycling</option>
              <option>Swimming</option>
              <option>Gym Workout</option>
              <option>Yoga</option>
              <option>Sports</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              min="1"
              value={data.duration}
              onChange={(e) => setData({ ...data, duration: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Intensity *</label>
            <select value={data.intensity} onChange={(e) => setData({ ...data, intensity: e.target.value })}>
              <option>Light</option>
              <option>Moderate</option>
              <option>Vigorous</option>
            </select>
          </div>
          <div className="form-group">
            <label>Calories Burned</label>
            <input
              type="number"
              value={data.calories}
              onChange={(e) => setData({ ...data, calories: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} rows="3" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

const MoodForm = ({ onSubmit, onCancel }) => {
  const [data, setData] = useState({
    mood: 'Happy',
    energy: 3,
    stress: 3,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="card form-card">
      <h3>Log Mood</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>How are you feeling? *</label>
          <select value={data.mood} onChange={(e) => setData({ ...data, mood: e.target.value })}>
            <option>Very Happy</option>
            <option>Happy</option>
            <option>Neutral</option>
            <option>Sad</option>
            <option>Very Sad</option>
            <option>Anxious</option>
            <option>Stressed</option>
            <option>Calm</option>
            <option>Excited</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Energy Level (1-5) *</label>
            <select value={data.energy} onChange={(e) => setData({ ...data, energy: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Stress Level (1-5) *</label>
            <select value={data.stress} onChange={(e) => setData({ ...data, stress: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            placeholder="What influenced your mood today?"
            rows="3"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Helper Functions
const getQualityEmoji = (quality) => {
  const emojis = { 1: '😴', 2: '😑', 3: '😊', 4: '😄', 5: '🌟' };
  return emojis[quality] || '😊';
};

const getMoodEmoji = (mood) => {
  const emojis = {
    'Very Happy': '😄',
    'Happy': '😊',
    'Neutral': '😐',
    'Sad': '😢',
    'Very Sad': '😭',
    'Anxious': '😰',
    'Stressed': '😫',
    'Calm': '😌',
    'Excited': '🤩'
  };
  return emojis[mood] || '😊';
};

export default WellnessTracker;
