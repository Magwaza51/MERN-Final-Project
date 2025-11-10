import React, { useState } from 'react';
import { toast } from 'react-toastify';

const HealthRecordForm = ({ onRecordAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'blood_pressure',
    systolic: '',
    diastolic: '',
    level: '',
    unit: 'mmHg',
    notes: '',
    deviceUsed: 'Manual Entry',
    recordedAt: new Date().toISOString().slice(0, 16)
  });
  const [loading, setLoading] = useState(false);

  const healthTypes = {
    blood_pressure: { label: 'Blood Pressure', unit: 'mmHg', hasLevels: false },
    blood_sugar: { label: 'Blood Sugar', unit: 'mg/dL', hasLevels: true },
    heart_rate: { label: 'Heart Rate', unit: 'bpm', hasLevels: true },
    weight: { label: 'Weight', unit: 'kg', hasLevels: true },
    temperature: { label: 'Temperature', unit: '°C', hasLevels: true },
    oxygen_saturation: { label: 'Oxygen Saturation', unit: '%', hasLevels: true }
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      unit: healthTypes[type].unit,
      systolic: '',
      diastolic: '',
      level: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let value = { unit: formData.unit };
      
      if (formData.type === 'blood_pressure') {
        if (!formData.systolic || !formData.diastolic) {
          toast.error('Please enter both systolic and diastolic values');
          setLoading(false);
          return;
        }
        value.systolic = parseInt(formData.systolic);
        value.diastolic = parseInt(formData.diastolic);
      } else {
        if (!formData.level) {
          toast.error('Please enter a value');
          setLoading(false);
          return;
        }
        value.level = parseFloat(formData.level);
      }

      const recordData = {
        type: formData.type,
        value,
        notes: formData.notes,
        deviceUsed: formData.deviceUsed,
        recordedAt: formData.recordedAt
      };

      // Simulate API call with mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock health assessment logic
      let isNormal = true;
      if (formData.type === 'blood_pressure') {
        const systolic = parseInt(formData.systolic);
        const diastolic = parseInt(formData.diastolic);
        isNormal = systolic >= 90 && systolic <= 140 && diastolic >= 60 && diastolic <= 90;
      } else if (formData.type === 'blood_sugar') {
        const level = parseFloat(formData.level);
        isNormal = level >= 70 && level <= 140;
      } else if (formData.type === 'heart_rate') {
        const level = parseFloat(formData.level);
        isNormal = level >= 60 && level <= 100;
      }
      
      if (!isNormal) {
        toast.warning('⚠️ This reading appears to be outside normal range. Consider consulting your healthcare provider.');
      } else {
        toast.success('Health record added successfully! (Demo Mode)');
      }

      console.log('Demo mode: Health record simulated:', recordData);
      onRecordAdded();
      
      // Reset form
      setFormData({
        type: 'blood_pressure',
        systolic: '',
        diastolic: '',
        level: '',
        unit: 'mmHg',
        notes: '',
        deviceUsed: 'Manual Entry',
        recordedAt: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      console.error('Error adding health record:', error);
      toast.error('Failed to add health record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Add Health Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Health Metric Type:</label>
          <select
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="form-control"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            {Object.entries(healthTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>

        {formData.type === 'blood_pressure' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Systolic (mmHg):</label>
              <input
                type="number"
                value={formData.systolic}
                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                placeholder="e.g., 120"
                min="60"
                max="250"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Diastolic (mmHg):</label>
              <input
                type="number"
                value={formData.diastolic}
                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                placeholder="e.g., 80"
                min="40"
                max="150"
                required
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label>{healthTypes[formData.type].label} ({formData.unit}):</label>
            <input
              type="number"
              step="0.1"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              placeholder={`Enter ${healthTypes[formData.type].label.toLowerCase()}`}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Device Used:</label>
          <input
            type="text"
            value={formData.deviceUsed}
            onChange={(e) => setFormData({ ...formData, deviceUsed: e.target.value })}
            placeholder="e.g., Digital BP Monitor, Glucometer"
          />
        </div>

        <div className="form-group">
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            value={formData.recordedAt}
            onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Notes (optional):</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes about this reading..."
            rows="3"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthRecordForm;