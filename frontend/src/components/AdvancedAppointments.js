import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Webcam from 'react-webcam';
import SimplePeer from 'simple-peer';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';

const AdvancedAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [videoCall, setVideoCall] = useState({
    active: false,
    stream: null,
    peer: null,
    remoteStream: null
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('routine');

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadAppointments = async () => {
    // Use mock data for demo - API might not be fully configured
    setAppointments([
      {
        id: 1,
        doctorName: 'Dr. Sarah Johnson',
        date: '2025-11-01',
        time: '10:00',
        type: 'Cardiology Consultation',
        status: 'confirmed'
      },
      {
        id: 2,
        doctorName: 'Dr. Michael Chen',
        date: '2025-11-05',
        time: '14:30',
        type: 'General Checkup',
        status: 'pending'
      }
    ]);
  };

  const loadDoctors = async () => {
    // Use mock data for demo - API might not be fully configured
    setDoctors([
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          rating: 4.8,
          experience: '15 years',
          languages: ['English', 'Spanish'],
          telemedicine: true,
          consultationFee: 150,
          image: '👩‍⚕️'
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          specialty: 'General Medicine',
          rating: 4.9,
          experience: '12 years',
          languages: ['English', 'Mandarin'],
          telemedicine: true,
          consultationFee: 120,
          image: '👨‍⚕️'
        },
        {
          id: 3,
          name: 'Dr. Emily Rodriguez',
          specialty: 'Dermatology',
          rating: 4.7,
          experience: '10 years',
          languages: ['English', 'Spanish'],
          telemedicine: false,
          consultationFee: 200,
          image: '👩‍⚕️'
        }
      ]);
  };

  const loadAvailableSlots = async () => {
    try {
      // Demo mode: Use mock available slots instead of API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSlots = [
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: false },
        { time: '14:00', available: true },
        { time: '14:30', available: true },
        { time: '15:00', available: true },
        { time: '15:30', available: false },
        { time: '16:00', available: true },
        { time: '16:30', available: true }
      ];
      
      setAvailableSlots(mockSlots);
      console.log('Demo mode: Mock appointment slots loaded');
    } catch (error) {
      console.error('Failed to load available slots:', error);
      // Fallback mock available slots
      setAvailableSlots([
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: false },
        { time: '14:00', available: true },
        { time: '14:30', available: true },
        { time: '15:00', available: true },
        { time: '15:30', available: false },
        { time: '16:00', available: true },
        { time: '16:30', available: true },
      ]);
    }
  };

  const bookAppointment = async (timeSlot) => {
    const appointmentData = {
      doctorId: selectedDoctor.id,
      date: selectedDate.toISOString().split('T')[0],
      time: timeSlot,
      type: appointmentType,
      urgency: urgencyLevel,
      symptoms: document.getElementById('symptoms').value,
      notes: document.getElementById('appointmentNotes').value
    };

    try {
      // Simulate appointment booking in demo mode
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Appointment booked:', appointmentData);
      toast.success('Appointment booked successfully!');
      setShowBookingForm(false);
      loadAppointments();
      loadAvailableSlots();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment');
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setVideoCall(prev => ({
        ...prev,
        active: true,
        stream: stream
      }));

      // Initialize peer connection (simplified for demo)
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream
      });

      peer.on('signal', (data) => {
        console.log('Peer signal:', data);
        // In real implementation, send this to the doctor via socket
      });

      peer.on('stream', (remoteStream) => {
        setVideoCall(prev => ({
          ...prev,
          remoteStream: remoteStream
        }));
      });

      setVideoCall(prev => ({
        ...prev,
        peer: peer
      }));

    } catch (error) {
      console.error('Video call error:', error);
      toast.error('Failed to start video call');
    }
  };

  const endVideoCall = () => {
    if (videoCall.stream) {
      videoCall.stream.getTracks().forEach(track => track.stop());
    }
    if (videoCall.peer) {
      videoCall.peer.destroy();
    }
    setVideoCall({
      active: false,
      stream: null,
      peer: null,
      remoteStream: null
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasAppointment = appointments.some(apt => 
        apt.date === dateStr
      );
      if (hasAppointment) {
        return 'has-appointment';
      }
    }
    return null;
  };

  return (
    <div className="advanced-appointments">
      <div className="appointments-header">
        <h2>📅 Advanced Appointment Booking</h2>
        <div className="header-stats">
          <div className="stat">
            <span>Upcoming: {appointments.filter(apt => new Date(apt.date) > new Date()).length}</span>
          </div>
          <div className="stat">
            <span>This Month: {appointments.filter(apt => {
              const aptDate = new Date(apt.date);
              const now = new Date();
              return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();
            }).length}</span>
          </div>
        </div>
      </div>

      {videoCall.active && (
        <div className="video-call-modal">
          <div className="video-call-container">
            <div className="video-header">
              <h3>Video Consultation - {selectedDoctor?.name}</h3>
              <button onClick={endVideoCall} className="end-call-btn">
                📞 End Call
              </button>
            </div>
            
            <div className="video-streams">
              <div className="doctor-stream">
                <div className="video-placeholder">
                  <span>Doctor Video</span>
                  {videoCall.remoteStream && (
                    <video 
                      autoPlay 
                      playsInline
                      ref={video => {
                        if (video) video.srcObject = videoCall.remoteStream;
                      }}
                    />
                  )}
                </div>
              </div>
              
              <div className="patient-stream">
                {videoCall.stream && (
                  <Webcam
                    audio={false}
                    height={200}
                    width={300}
                    videoConstraints={{
                      width: 300,
                      height: 200,
                      facingMode: "user"
                    }}
                  />
                )}
              </div>
            </div>

            <div className="video-controls">
              <button className="control-btn">🎤</button>
              <button className="control-btn">📹</button>
              <button className="control-btn">💬</button>
              <button className="control-btn">📋</button>
            </div>
          </div>
        </div>
      )}

      <div className="appointments-content">
        <div className="calendar-section">
          <div className="calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={tileClassName}
              minDate={new Date()}
            />
            
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-dot available"></span>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot has-appointment"></span>
                <span>Has Appointment</span>
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="date-info">
              <h3>Selected Date</h3>
              <p>{selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          )}
        </div>

        <div className="doctors-section">
          <h3>Available Doctors</h3>
          <div className="doctors-grid">
            {doctors && doctors.length > 0 ? doctors.map(doctor => (
              <div 
                key={doctor.id} 
                className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="doctor-avatar">{doctor.image}</div>
                <div className="doctor-info">
                  <h4>{doctor.name}</h4>
                  <p className="specialty">{doctor.specialty}</p>
                  <div className="doctor-meta">
                    <span className="rating">⭐ {doctor.rating}</span>
                    <span className="experience">{doctor.experience}</span>
                  </div>
                  <div className="doctor-features">
                    {doctor.telemedicine && (
                      <span className="feature telemedicine">📹 Telemedicine</span>
                    )}
                    <span className="feature fee">${doctor.consultationFee}</span>
                  </div>
                  <div className="languages">
                    Languages: {doctor.languages.join(', ')}
                  </div>
                </div>
              </div>
            )) : (
              <div className="no-doctors">
                <p>Loading doctors...</p>
              </div>
            )}
          </div>
        </div>

        {selectedDoctor && (
          <div className="booking-section">
            <div className="appointment-types">
              <h4>Appointment Type</h4>
              <div className="type-options">
                <label className={appointmentType === 'in-person' ? 'selected' : ''}>
                  <input
                    type="radio"
                    value="in-person"
                    checked={appointmentType === 'in-person'}
                    onChange={(e) => setAppointmentType(e.target.value)}
                  />
                  🏥 In-Person Visit
                </label>
                
                {selectedDoctor.telemedicine && (
                  <label className={appointmentType === 'telemedicine' ? 'selected' : ''}>
                    <input
                      type="radio"
                      value="telemedicine"
                      checked={appointmentType === 'telemedicine'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                    />
                    📹 Video Consultation
                  </label>
                )}
              </div>
            </div>

            <div className="urgency-level">
              <h4>Urgency Level</h4>
              <select 
                value={urgencyLevel} 
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="urgency-select"
              >
                <option value="routine">Routine (1-2 weeks)</option>
                <option value="urgent">Urgent (2-3 days)</option>
                <option value="same-day">Same Day</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="available-slots">
              <h4>Available Time Slots</h4>
              <div className="slots-grid">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`slot-btn ${!slot.available ? 'unavailable' : ''}`}
                    disabled={!slot.available}
                    onClick={() => slot.available && setShowBookingForm(slot.time)}
                  >
                    {slot.time}
                    {!slot.available && <span className="booked">Booked</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showBookingForm && (
        <div className="booking-modal">
          <div className="booking-form">
            <h3>Complete Booking</h3>
            <div className="booking-summary">
              <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
              <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {showBookingForm}</p>
              <p><strong>Type:</strong> {appointmentType}</p>
              <p><strong>Fee:</strong> ${selectedDoctor.consultationFee}</p>
            </div>

            <div className="form-group">
              <label>Primary Symptoms/Concerns:</label>
              <textarea 
                id="symptoms"
                placeholder="Describe your symptoms or reason for visit..."
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes:</label>
              <textarea 
                id="appointmentNotes"
                placeholder="Any additional information for the doctor..."
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button 
                onClick={() => bookAppointment(showBookingForm)}
                className="book-btn"
              >
                💳 Book & Pay ${selectedDoctor.consultationFee}
              </button>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .advanced-appointments {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .appointments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          padding: 10px 15px;
          background: #f8f9fa;
          border-radius: 8px;
          font-weight: bold;
          color: #4f46e5;
        }

        .video-call-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-call-container {
          background: white;
          border-radius: 15px;
          padding: 20px;
          max-width: 800px;
          width: 90%;
        }

        .video-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .end-call-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
        }

        .video-streams {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .video-placeholder {
          background: #000;
          color: white;
          padding: 100px 20px;
          text-align: center;
          border-radius: 10px;
          position: relative;
        }

        .video-placeholder video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .video-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .control-btn {
          padding: 15px;
          border: none;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .appointments-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 30px;
        }

        .calendar-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }

        .react-calendar__tile.has-appointment {
          background: #4f46e5 !important;
          color: white !important;
        }

        .calendar-legend {
          display: flex;
          gap: 15px;
          margin-top: 15px;
          font-size: 14px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.available {
          background: #28a745;
        }

        .legend-dot.has-appointment {
          background: #4f46e5;
        }

        .date-info {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }

        .doctors-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .doctors-grid {
          display: grid;
          gap: 15px;
          margin-top: 15px;
        }

        .doctor-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .doctor-card:hover {
          border-color: #4f46e5;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.1);
        }

        .doctor-card.selected {
          border-color: #4f46e5;
          background: #f8f9ff;
        }

        .doctor-avatar {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .doctor-info {
          flex: 1;
        }

        .doctor-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .specialty {
          color: #4f46e5;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        .doctor-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .rating {
          color: #ffc107;
        }

        .experience {
          color: #666;
        }

        .doctor-features {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }

        .feature {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .feature.telemedicine {
          background: #d4edda;
          color: #155724;
        }

        .feature.fee {
          background: #fff3cd;
          color: #856404;
        }

        .languages {
          font-size: 12px;
          color: #666;
        }

        .booking-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .appointment-types h4,
        .urgency-level h4,
        .available-slots h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .type-options {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }

        .type-options label {
          padding: 12px 20px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-options label.selected {
          border-color: #4f46e5;
          background: #f8f9ff;
        }

        .type-options input {
          margin: 0;
        }

        .urgency-select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 14px;
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }

        .slot-btn {
          padding: 12px;
          border: 2px solid #4f46e5;
          background: white;
          color: #4f46e5;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          position: relative;
        }

        .slot-btn:hover:not(:disabled) {
          background: #4f46e5;
          color: white;
        }

        .slot-btn:disabled {
          border-color: #ddd;
          color: #999;
          cursor: not-allowed;
          background: #f8f9fa;
        }

        .booked {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc3545;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .booking-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .booking-form {
          background: white;
          padding: 30px;
          border-radius: 15px;
          max-width: 500px;
          width: 90%;
        }

        .booking-summary {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .booking-summary p {
          margin: 5px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }

        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          min-height: 80px;
          resize: vertical;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .book-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .appointments-content {
            grid-template-columns: 1fr;
          }
          
          .video-streams {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedAppointments;