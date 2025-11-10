import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AppointmentBooking from './AppointmentBooking';
import DoctorMap from './DoctorMap';
import LocationSearch from './LocationSearch';
import './DoctorSearch.css';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    specialization: '',
    location: '',
    name: '',
    minRating: 0,
    sortBy: 'rating'
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const specializations = [
    'General Practice', 'Cardiology', 'Dermatology', 'Endocrinology',
    'Gastroenterology', 'Neurology', 'Oncology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Pulmonology', 'Rheumatology'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchFilters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Use mock doctors data for demo
      const mockDoctors = [
        {
          _id: '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          rating: 4.8,
          experience: '15 years',
          location: 'Downtown Medical Center',
          consultationFee: 150,
          image: '👩‍⚕️',
          languages: ['English', 'Spanish'],
          education: 'MD from Harvard Medical School',
          availableSlots: ['09:00', '10:30', '14:00', '15:30']
        },
        {
          _id: '2',
          name: 'Dr. Michael Chen',
          specialty: 'General Medicine',
          rating: 4.9,
          experience: '12 years',
          location: 'City Health Clinic',
          consultationFee: 120,
          image: '👨‍⚕️',
          languages: ['English', 'Mandarin'],
          education: 'MD from Johns Hopkins',
          availableSlots: ['08:30', '11:00', '13:30', '16:00']
        },
        {
          _id: '3',
          name: 'Dr. Emily Rodriguez',
          specialty: 'Dermatology',
          rating: 4.7,
          experience: '10 years',
          location: 'Skin Care Center',
          consultationFee: 200,
          image: '👩‍⚕️',
          languages: ['English', 'Spanish'],
          education: 'MD from Stanford Medical School',
          availableSlots: ['10:00', '12:00', '15:00', '17:00']
        }
      ];
      
      setDoctors(mockDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    // Filter by specialization
    if (searchFilters.specialization) {
      filtered = filtered.filter(doctor => 
        doctor.specialization.toLowerCase().includes(searchFilters.specialization.toLowerCase())
      );
    }

    // Filter by location
    if (searchFilters.location) {
      filtered = filtered.filter(doctor => 
        doctor.location.city.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
        doctor.location.state.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Filter by name
    if (searchFilters.name) {
      filtered = filtered.filter(doctor => 
        doctor.userId.name.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }

    // Filter by minimum rating
    if (searchFilters.minRating > 0) {
      filtered = filtered.filter(doctor => doctor.rating >= searchFilters.minRating);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'fee':
          return a.consultationFee - b.consultationFee;
        case 'name':
          return a.userId.name.localeCompare(b.userId.name);
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setSearchFilters({
      ...searchFilters,
      [filterName]: value
    });
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleBookingSuccess = (appointment) => {
    setShowBooking(false);
    setSelectedDoctor(null);
    toast.success('Appointment booked successfully!');
  };

  const handleBookingCancel = () => {
    setShowBooking(false);
    setSelectedDoctor(null);
  };

  const handleLocationFound = (location) => {
    setUserLocation(location);
    // Optionally update the location filter
    setSearchFilters({
      ...searchFilters,
      location: location.address
    });
  };

  const handleMapDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
        <span className="rating-number">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (showBooking && selectedDoctor) {
    return (
      <AppointmentBooking
        doctor={selectedDoctor}
        onBook={handleBookingSuccess}
        onCancel={handleBookingCancel}
      />
    );
  }

  return (
    <div className="doctor-search">
      <div className="search-header">
        <h2>Find a Doctor</h2>
        <p>Search and book appointments with qualified healthcare professionals</p>
      </div>

      {/* Location Search Component */}
      <LocationSearch 
        onLocationFound={handleLocationFound} 
        currentLocation={userLocation}
      />

      {/* Search Filters */}
      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Doctor Name</label>
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Specialization</label>
            <select
              value={searchFilters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search Radius</label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            >
              <option value={5}>5 miles</option>
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Minimum Rating</label>
            <select
              value={searchFilters.minRating}
              onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={searchFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="rating">Rating (High to Low)</option>
              <option value="experience">Experience (High to Low)</option>
              <option value="fee">Consultation Fee (Low to High)</option>
              <option value="name">Name (A to Z)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>View Mode</label>
            <div className="view-mode-toggle">
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
              <button
                className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <DoctorMap
          doctors={filteredDoctors}
          onDoctorSelect={handleMapDoctorSelect}
          userLocation={userLocation}
          searchRadius={searchRadius}
        />
      )}

      {/* Results */}
      {viewMode === 'list' && (
        <div className="search-results">
          <div className="results-header">
            <h3>
              {loading ? 'Loading...' : `${filteredDoctors.length} Doctor${filteredDoctors.length !== 1 ? 's' : ''} Found`}
            </h3>
          </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="no-results">
            <p>No doctors found matching your criteria.</p>
            <button onClick={() => setSearchFilters({
              specialization: '',
              location: '',
              name: '',
              minRating: 0,
              sortBy: 'rating'
            })}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-header">
                  <div className="doctor-info">
                    <h4>Dr. {doctor.userId.name}</h4>
                    <p className="specialization">{doctor.specialization}</p>
                    <p className="experience">{doctor.experience} years experience</p>
                  </div>
                  <div className="doctor-rating">
                    {renderStars(doctor.rating)}
                  </div>
                </div>

                <div className="doctor-details">
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span>{doctor.location.city}, {doctor.location.state}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Consultation Fee:</span>
                    <span className="fee">${doctor.consultationFee}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Languages:</span>
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>

                {doctor.qualifications && doctor.qualifications.length > 0 && (
                  <div className="qualifications">
                    <h5>Qualifications:</h5>
                    <ul>
                      {doctor.qualifications.slice(0, 2).map((qual, index) => (
                        <li key={index}>{qual}</li>
                      ))}
                      {doctor.qualifications.length > 2 && (
                        <li>+{doctor.qualifications.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="doctor-actions">
                  <button
                    className="book-appointment-btn"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Book Appointment
                  </button>
                  <div className="contact-info">
                    <small>📧 {doctor.userId.email}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;