import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';
import './MedicationTracker.css';

const MedicationTracker = () => {
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, medicationId: null });
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    prescribedBy: '',
    refillDate: ''
  });

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = () => {
    const saved = localStorage.getItem('medications');
    if (saved) {
      setMedications(JSON.parse(saved));
    }
  };

  const saveMedications = (meds) => {
    localStorage.setItem('medications', JSON.stringify(meds));
    setMedications(meds);
  };

  const handleAddTime = () => {
    setFormData({
      ...formData,
      times: [...formData.times, '12:00']
    });
  };

  const handleRemoveTime = (index) => {
    setFormData({
      ...formData,
      times: formData.times.filter((_, i) => i !== index)
    });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMedication = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      taken: []
    };
    saveMedications([...medications, newMedication]);
    toast.success('💊 Medication added successfully!');
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: '',
      prescribedBy: '',
      refillDate: ''
    });
  };

  const handleDelete = (id) => {
    setDeleteDialog({ isOpen: true, medicationId: id });
  };

  const confirmDelete = () => {
    const updated = medications.filter(m => m.id !== deleteDialog.medicationId);
    saveMedications(updated);
    toast.success('Medication deleted');
    setDeleteDialog({ isOpen: false, medicationId: null });
  };

  const markAsTaken = (medId, time) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = medications.map(med => {
      if (med.id === medId) {
        const takenKey = `${today}-${time}`;
        const taken = med.taken || [];
        if (!taken.includes(takenKey)) {
          return { ...med, taken: [...taken, takenKey] };
        }
      }
      return med;
    });
    saveMedications(updated);
    toast.success('✅ Marked as taken');
  };

  const isTakenToday = (med, time) => {
    const today = new Date().toISOString().split('T')[0];
    const takenKey = `${today}-${time}`;
    return (med.taken || []).includes(takenKey);
  };

  const getUpcomingDoses = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const upcoming = [];

    medications.forEach(med => {
      med.times.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        if (timeInMinutes > currentTime && !isTakenToday(med, time)) {
          upcoming.push({ ...med, nextTime: time, timeInMinutes });
        }
      });
    });

    return upcoming.sort((a, b) => a.timeInMinutes - b.timeInMinutes).slice(0, 3);
  };

  return (
    <div className="medication-tracker">
      <div className="page-header">
        <h1>💊 Medication Tracker</h1>
        <p>Manage your medications and never miss a dose</p>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '➕ Add Medication'}
        </button>
      </div>

      {showAddForm && (
        <div className="card medication-form">
          <h3>Add New Medication</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Aspirin"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="e.g., 100mg"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Frequency *</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times-daily">Three Times Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reminder Times *</label>
              {formData.times.map((time, index) => (
                <div key={index} className="time-input-group">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                  />
                  {formData.times.length > 1 && (
                    <button type="button" onClick={() => handleRemoveTime(index)} className="btn-remove-time">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddTime} className="btn btn-secondary btn-sm">
                ➕ Add Another Time
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prescribed By</label>
                <input
                  type="text"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  placeholder="Doctor's name"
                />
              </div>
              <div className="form-group">
                <label>Refill Date</label>
                <input
                  type="date"
                  value={formData.refillDate}
                  onChange={(e) => setFormData({ ...formData, refillDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Medication</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Doses */}
      {getUpcomingDoses().length > 0 && (
        <div className="card upcoming-doses">
          <h3>🔔 Upcoming Doses Today</h3>
          <div className="upcoming-list">
            {getUpcomingDoses().map((med, index) => (
              <div key={index} className="upcoming-item">
                <div className="upcoming-info">
                  <strong>{med.name}</strong> - {med.dosage}
                  <span className="upcoming-time">{med.nextTime}</span>
                </div>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => markAsTaken(med.id, med.nextTime)}
                >
                  ✓ Take Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications List */}
      <div className="medications-grid">
        {medications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3>No medications added yet</h3>
            <p>Add your first medication to start tracking</p>
          </div>
        ) : (
          medications.map((med) => (
            <div key={med.id} className="medication-card">
              <div className="medication-header">
                <h3>{med.name}</h3>
                <button className="btn-delete" onClick={() => handleDelete(med.id)}>
                  🗑️
                </button>
              </div>
              <div className="medication-info">
                <p><strong>Dosage:</strong> {med.dosage}</p>
                <p><strong>Frequency:</strong> {med.frequency.replace('-', ' ')}</p>
                {med.prescribedBy && <p><strong>Prescribed by:</strong> {med.prescribedBy}</p>}
                {med.notes && <p className="medication-notes">{med.notes}</p>}
              </div>
              <div className="medication-times">
                <strong>Daily Schedule:</strong>
                <div className="time-badges">
                  {med.times.map((time, idx) => (
                    <div key={idx} className="time-badge-container">
                      <span className={`time-badge ${isTakenToday(med, time) ? 'taken' : ''}`}>
                        {time}
                      </span>
                      {!isTakenToday(med, time) && (
                        <button
                          className="btn-take"
                          onClick={() => markAsTaken(med.id, time)}
                          title="Mark as taken"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {med.refillDate && (
                <div className="refill-reminder">
                  <strong>Refill:</strong> {new Date(med.refillDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Medication"
        message="Are you sure you want to delete this medication? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, medicationId: null })}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default MedicationTracker;
