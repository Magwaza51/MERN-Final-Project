import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppointmentBooking from '../components/AppointmentBooking';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDoctorProfile();
    fetchDoctorReviews();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/doctors/${doctorId}`);
      
      if (response.ok) {
        const data = await response.json();
        setDoctor(data.doctor);
      } else {
        throw new Error('Doctor not found');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor profile');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorReviews = async () => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const renderStars = (rating) => {
    const average = rating.average || rating;
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= average ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
        <span className="rating-number">({average}) - {rating.count || 0} reviews</span>
      </div>
    );
  };

  const formatAvailability = (availability) => {
    const availableDays = availability.filter(day => day.isAvailable);
    if (availableDays.length === 0) return 'No availability set';
    
    return availableDays.map(day => 
      `${day.day}: ${day.startTime} - ${day.endTime}`
    ).join(', ');
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    toast.success('Appointment booked successfully!');
  };

  const handleBookingCancel = () => {
    setShowBooking(false);
  };

  if (loading) {
    return (
      <div className="doctor-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-error">
        <h2>Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="btn btn-primary">
          Back to Doctor Search
        </button>
      </div>
    );
  }

  if (showBooking) {
    return (
      <AppointmentBooking
        doctor={doctor}
        onBook={handleBookingSuccess}
        onCancel={handleBookingCancel}
      />
    );
  }

  return (
    <div className="doctor-profile">
      {/* Header Section */}
      <div className="doctor-header">
        <div className="doctor-avatar">
          <div className="avatar-placeholder">
            {doctor.profileImage ? (
              <img src={doctor.profileImage} alt={doctor.userId.name} />
            ) : (
              <span className="avatar-initials">
                {doctor.userId.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          {doctor.isVerified && (
            <div className="verified-badge" title="Verified Doctor">
              ✓
            </div>
          )}
        </div>

        <div className="doctor-info">
          <h1>Dr. {doctor.userId.name}</h1>
          <p className="specialization">{doctor.specialization}</p>
          <div className="rating-section">
            {renderStars(doctor.rating)}
          </div>
          <div className="basic-info">
            <span className="experience">📅 {doctor.experience} years experience</span>
            <span className="consultation-fee">💰 ${doctor.consultationFee} consultation</span>
            <span className="location">📍 {doctor.location.city}, {doctor.location.state}</span>
          </div>
        </div>

        <div className="doctor-actions">
          <button 
            className="book-appointment-btn primary"
            onClick={() => setShowBooking(true)}
          >
            📅 Book Appointment
          </button>
          {doctor.isAvailableOnline && (
            <button className="video-consultation-btn">
              💻 Video Consultation
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'qualifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('qualifications')}
        >
          Qualifications
        </button>
        <button 
          className={`tab ${activeTab === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          Availability
        </button>
        <button 
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="bio-section">
              <h3>About Dr. {doctor.userId.name}</h3>
              <p>{doctor.bio || 'No biography available.'}</p>
            </div>

            <div className="quick-info">
              <div className="info-grid">
                <div className="info-item">
                  <h4>Languages</h4>
                  <p>{doctor.languages?.join(', ') || 'Not specified'}</p>
                </div>
                <div className="info-item">
                  <h4>Hospital Affiliation</h4>
                  <p>{doctor.hospital?.name || 'Private Practice'}</p>
                </div>
                <div className="info-item">
                  <h4>License Number</h4>
                  <p>{doctor.licenseNumber}</p>
                </div>
                <div className="info-item">
                  <h4>Services Offered</h4>
                  <p>
                    {doctor.isAvailableOnline ? 'In-person, Video calls, Phone consultations' : 'In-person consultations'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qualifications' && (
          <div className="qualifications-tab">
            <h3>Education & Qualifications</h3>
            <div className="qualifications-list">
              {doctor.qualifications && doctor.qualifications.length > 0 ? (
                doctor.qualifications.map((qual, index) => (
                  <div key={index} className="qualification-item">
                    <div className="qualification-icon">🎓</div>
                    <div className="qualification-details">
                      <h4>{qual.degree}</h4>
                      <p>{qual.institution}</p>
                      <span className="year">{qual.year}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No qualifications listed.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="availability-tab">
            <h3>Availability Schedule</h3>
            <div className="availability-grid">
              {doctor.availability.map((day, index) => (
                <div key={index} className={`availability-day ${day.isAvailable ? 'available' : 'unavailable'}`}>
                  <h4>{day.day}</h4>
                  {day.isAvailable ? (
                    <p>{day.startTime} - {day.endTime}</p>
                  ) : (
                    <p>Unavailable</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <h3>Patient Reviews</h3>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-name">{review.patientName}</div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to leave a review!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;