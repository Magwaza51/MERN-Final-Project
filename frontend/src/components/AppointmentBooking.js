import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AppointmentBooking.css';

const AppointmentBooking = ({ doctor, onBook, onCancel }) => {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    timeSlot: { startTime: '', endTime: '' },
    type: 'in-person',
    reason: '',
    symptoms: [],
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setFormData({
      ...formData,
      appointmentDate: date,
      timeSlot: { startTime: '', endTime: '' }
    });

    if (date) {
      await fetchAvailableSlots(date);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      setLoading(true);
      
      // Demo mode: Use mock available slots
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSlots = [
        '09:00', '09:30', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00'
      ];
      
      setAvailableSlots(mockSlots);
      console.log('Demo mode: Mock slots loaded for date', date);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (slot) => {
    setFormData({
      ...formData,
      timeSlot: slot
    });
  };

  const addSymptom = () => {
    if (symptomInput.trim() && !formData.symptoms.includes(symptomInput.trim())) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptomInput.trim()]
      });
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter(symptom => symptom !== symptomToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.appointmentDate || !formData.timeSlot.startTime || !formData.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate appointment booking in demo mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const appointmentData = {
        id: Date.now(),
        doctorId: doctor._id,
        doctorName: doctor.name,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        type: formData.type,
        reason: formData.reason,
        symptoms: formData.symptoms,
        notes: formData.notes,
        status: 'confirmed',
        bookingTime: new Date().toISOString()
      };

      console.log('Appointment booked:', appointmentData);

      // Simulate successful booking in demo mode
      toast.success('Appointment booked successfully!');
      onBook && onBook(appointmentData);
      
      // Reset form
      setFormData({
        appointmentDate: '',
        timeSlot: { startTime: '', endTime: '' },
        type: 'in-person',
        reason: '',
        symptoms: [],
        notes: ''
      });
      setAvailableSlots([]);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointment-booking">
      <div className="booking-header">
        <h3>Book Appointment with Dr. {doctor.userId.name}</h3>
        <p className="specialization">{doctor.specialization}</p>
        <p className="consultation-fee">Consultation Fee: ${doctor.consultationFee}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Date Selection */}
        <div className="form-group">
          <label htmlFor="appointmentDate">Appointment Date *</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleDateChange}
            min={today}
            required
          />
        </div>

        {/* Time Slot Selection */}
        {formData.appointmentDate && (
          <div className="form-group">
            <label>Available Time Slots *</label>
            {loading ? (
              <div className="loading">Loading available slots...</div>
            ) : availableSlots.length > 0 ? (
              <div className="time-slots">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`time-slot ${
                      formData.timeSlot.startTime === slot.startTime ? 'selected' : ''
                    }`}
                    onClick={() => handleTimeSlotChange(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-slots">No available slots for this date</p>
            )}
          </div>
        )}

        {/* Appointment Type */}
        <div className="form-group">
          <label htmlFor="type">Appointment Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="in-person">In-Person</option>
            <option value="online">Online Video Call</option>
            <option value="phone">Phone Call</option>
          </select>
        </div>

        {/* Reason for Visit */}
        <div className="form-group">
          <label htmlFor="reason">Reason for Visit *</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Please describe the reason for your visit..."
            rows="3"
            required
          />
        </div>

        {/* Symptoms */}
        <div className="form-group">
          <label>Symptoms (Optional)</label>
          <div className="symptoms-input">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="Add a symptom..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
            />
            <button type="button" onClick={addSymptom} className="add-symptom-btn">
              Add
            </button>
          </div>
          {formData.symptoms.length > 0 && (
            <div className="symptoms-list">
              {formData.symptoms.map((symptom, index) => (
                <span key={index} className="symptom-tag">
                  {symptom}
                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    className="remove-symptom"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label htmlFor="notes">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional information you'd like to share..."
            rows="2"
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="book-btn"
            disabled={loading || !formData.appointmentDate || !formData.timeSlot.startTime}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;