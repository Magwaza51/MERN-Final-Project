import React, { useState } from 'react';
import AppointmentsList from '../components/AppointmentsList';
import AppointmentBooking from '../components/AppointmentBooking';
import './Appointments.css';

const Appointments = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDoctors] = useState([
    {
      _id: 'doc1',
      userId: { name: 'Sarah Johnson' },
      specialization: 'Cardiologist',
      consultationFee: 150,
      rating: 4.8,
      experience: '12 years'
    },
    {
      _id: 'doc2',
      userId: { name: 'Michael Chen' },
      specialization: 'Neurologist',
      consultationFee: 180,
      rating: 4.9,
      experience: '15 years'
    },
    {
      _id: 'doc3',
      userId: { name: 'Emily Davis' },
      specialization: 'Dermatologist',
      consultationFee: 120,
      rating: 4.7,
      experience: '8 years'
    },
    {
      _id: 'doc4',
      userId: { name: 'Robert Wilson' },
      specialization: 'General Practitioner',
      consultationFee: 100,
      rating: 4.6,
      experience: '10 years'
    }
  ]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleBookingComplete = () => {
    setShowBooking(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Appointments</h1>
        <p>Book and manage your medical appointments</p>
      </div>

      {!showBooking ? (
        <>
          {/* Book New Appointment Section */}
          <div className="booking-section">
            <h2>Book New Appointment</h2>
            <p>Select a doctor to schedule your appointment</p>
            
            <div className="doctors-grid">
              {availableDoctors.map(doctor => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-avatar">
                    {doctor.userId.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="doctor-info">
                    <h3>Dr. {doctor.userId.name}</h3>
                    <p className="specialization">{doctor.specialization}</p>
                    <div className="doctor-meta">
                      <span className="rating">⭐ {doctor.rating}</span>
                      <span className="experience">🩺 {doctor.experience}</span>
                    </div>
                    <div className="consultation-fee">
                      💰 ${doctor.consultationFee} per session
                    </div>
                  </div>
                  <button
                    className="book-btn"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Appointments Section */}
          <div className="my-appointments-section">
            <AppointmentsList />
          </div>
        </>
      ) : (
        <div className="booking-form-section">
          <AppointmentBooking
            doctor={selectedDoctor}
            onBook={handleBookingComplete}
            onCancel={() => setShowBooking(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Appointments;