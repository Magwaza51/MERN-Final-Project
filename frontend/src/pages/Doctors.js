import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Doctors.css';
import './Doctors.css';

const Doctors = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityType, setFacilityType] = useState('all'); // all, doctor, hospital, clinic
  const [radius, setRadius] = useState(5); // km
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Mock facilities data with locations
  const mockFacilities = [
    // Doctors
    {
      id: 'doc1',
      type: 'doctor',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      rating: 4.8,
      experience: '15 years',
      location: {
        address: '123 Medical Plaza, Downtown',
        lat: -26.2041,
        lng: 28.0473
      },
      phone: '+27 11 123 4567',
      consultationFee: 850,
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      languages: ['English', 'Afrikaans'],
      distance: 2.5
    },
    {
      id: 'doc2',
      type: 'doctor',
      name: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      rating: 4.9,
      experience: '12 years',
      location: {
        address: '456 Health Street, Sandton',
        lat: -26.1076,
        lng: 28.0567
      },
      phone: '+27 11 234 5678',
      consultationFee: 650,
      hours: 'Mon-Sat: 7:00 AM - 8:00 PM',
      languages: ['English', 'Mandarin'],
      distance: 4.2
    },
    {
      id: 'doc3',
      type: 'doctor',
      name: 'Dr. Amina Patel',
      specialty: 'Pediatrician',
      rating: 4.7,
      experience: '10 years',
      location: {
        address: '789 Children Hospital, Rosebank',
        lat: -26.1467,
        lng: 28.0419
      },
      phone: '+27 11 345 6789',
      consultationFee: 700,
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      languages: ['English', 'Hindi', 'Gujarati'],
      distance: 3.1
    },
    // Hospitals
    {
      id: 'hosp1',
      type: 'hospital',
      name: 'Johannesburg General Hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.6,
      beds: 500,
      location: {
        address: '17 Hospital Road, Parktown',
        lat: -26.1789,
        lng: 28.0385
      },
      phone: '+27 11 488 4911',
      services: ['Emergency', 'ICU', 'Surgery', 'Maternity', 'Oncology'],
      hours: '24/7 Emergency Services',
      distance: 5.8
    },
    {
      id: 'hosp2',
      type: 'hospital',
      name: 'Netcare Milpark Hospital',
      specialty: 'Private Hospital',
      rating: 4.8,
      beds: 400,
      location: {
        address: '9 Guild Road, Parktown West',
        lat: -26.1834,
        lng: 28.0142
      },
      phone: '+27 11 480 5600',
      services: ['Cardiology', 'Neurology', 'Orthopedics', 'Trauma'],
      hours: '24/7',
      distance: 6.5
    },
    // Clinics
    {
      id: 'clinic1',
      type: 'clinic',
      name: 'Sandton Day Clinic',
      specialty: 'Primary Care Clinic',
      rating: 4.5,
      location: {
        address: '22 Rivonia Road, Sandton',
        lat: -26.1055,
        lng: 28.0542
      },
      phone: '+27 11 883 0000',
      services: ['GP Consultation', 'Minor Procedures', 'Vaccinations', 'Lab Tests'],
      hours: 'Mon-Sun: 7:00 AM - 10:00 PM',
      waitTime: '15-30 mins',
      distance: 4.0
    },
    {
      id: 'clinic2',
      type: 'clinic',
      name: 'Rosebank Wellness Clinic',
      specialty: 'Walk-in Clinic',
      rating: 4.4,
      location: {
        address: '50 Bath Avenue, Rosebank',
        lat: -26.1449,
        lng: 28.0417
      },
      phone: '+27 11 788 1234',
      services: ['Family Medicine', 'Travel Vaccines', 'Health Screenings'],
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
      waitTime: '20-40 mins',
      distance: 3.3
    },
    {
      id: 'clinic3',
      type: 'clinic',
      name: 'Downtown Health Centre',
      specialty: 'Community Clinic',
      rating: 4.3,
      location: {
        address: '101 Main Street, CBD',
        lat: -26.2050,
        lng: 28.0467
      },
      phone: '+27 11 375 5555',
      services: ['Primary Care', 'Chronic Disease Management', 'HIV/TB Treatment'],
      hours: 'Mon-Sat: 7:00 AM - 5:00 PM',
      waitTime: '30-60 mins',
      distance: 2.8
    }
  ];

  useEffect(() => {
    getUserLocation();
    setFacilities(mockFacilities);
    setFilteredFacilities(mockFacilities);
  }, []);

  useEffect(() => {
    filterFacilities();
  }, [searchQuery, facilityType, radius, facilities]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location detected!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.info('Using default location (Johannesburg)');
          setUserLocation({ lat: -26.2041, lng: 28.0473 });
        }
      );
    } else {
      toast.warning('Geolocation not supported');
      setUserLocation({ lat: -26.2041, lng: 28.0473 });
    }
  };

  const filterFacilities = () => {
    let filtered = [...facilities];

    // Filter by type
    if (facilityType !== 'all') {
      filtered = filtered.filter(f => f.type === facilityType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by radius
    filtered = filtered.filter(f => f.distance <= radius);

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);

    setFilteredFacilities(filtered);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️';
      case 'hospital': return '🏥';
      case 'clinic': return '🏪';
      default: return '📍';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'doctor': return '#4f46e5';
      case 'hospital': return '#dc2626';
      case 'clinic': return '#059669';
      default: return '#666';
    }
  };

  return (
    <div className="doctors-page-new">
      <div className="search-header">
        <h1>🏥 Find Healthcare Near You</h1>
        <p>Discover doctors, hospitals, and clinics in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="search-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, specialty, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={getUserLocation} className="location-btn">
            📍 Use My Location
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Type:</label>
            <select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
              <option value="all">All</option>
              <option value="doctor">Doctors</option>
              <option value="hospital">Hospitals</option>
              <option value="clinic">Clinics</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Radius: {radius} km</label>
            <input
              type="range"
              min="1"
              max="20"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="radius-slider"
            />
          </div>
        </div>

        <div className="results-count">
          Found {filteredFacilities.length} facilities within {radius}km
        </div>
      </div>

      {/* Results Grid */}
      <div className="facilities-grid">
        {filteredFacilities.map(facility => (
          <div
            key={facility.id}
            className="facility-card"
            style={{ borderLeft: `4px solid ${getTypeColor(facility.type)}` }}
          >
            <div className="facility-header">
              <div className="facility-icon">{getIcon(facility.type)}</div>
              <div className="facility-title">
                <h3>{facility.name}</h3>
                <span className="facility-type" style={{ color: getTypeColor(facility.type) }}>
                  {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                </span>
              </div>
              <div className="facility-rating">
                ⭐ {facility.rating}
              </div>
            </div>

            <div className="facility-info">
              <div className="info-item">
                <span className="info-label">Specialty:</span>
                <span className="info-value">{facility.specialty}</span>
              </div>

              {facility.experience && (
                <div className="info-item">
                  <span className="info-label">Experience:</span>
                  <span className="info-value">{facility.experience}</span>
                </div>
              )}

              {facility.beds && (
                <div className="info-item">
                  <span className="info-label">Beds:</span>
                  <span className="info-value">{facility.beds} beds</span>
                </div>
              )}

              {facility.waitTime && (
                <div className="info-item">
                  <span className="info-label">Wait Time:</span>
                  <span className="info-value">{facility.waitTime}</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">📍 Location:</span>
                <span className="info-value">{facility.location.address}</span>
              </div>

              <div className="info-item">
                <span className="info-label">📞 Phone:</span>
                <span className="info-value">{facility.phone}</span>
              </div>

              <div className="info-item">
                <span className="info-label">🕐 Hours:</span>
                <span className="info-value">{facility.hours}</span>
              </div>

              <div className="info-item distance-item">
                <span className="distance-badge">
                  📏 {facility.distance} km away
                </span>
              </div>

              {facility.consultationFee && (
                <div className="info-item fee-item">
                  <span className="fee-badge">
                    💰 R{facility.consultationFee} consultation
                  </span>
                </div>
              )}

              {facility.services && (
                <div className="services">
                  <strong>Services:</strong>
                  <div className="service-tags">
                    {facility.services.map((service, idx) => (
                      <span key={idx} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>
              )}

              {facility.languages && (
                <div className="languages">
                  <strong>Languages:</strong> {facility.languages.join(', ')}
                </div>
              )}
            </div>

            <div className="facility-actions">
              <button
                className="action-btn directions-btn"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${facility.location.lat},${facility.location.lng}`, '_blank')}
              >
                🗺️ Directions
              </button>
              <button className="action-btn call-btn" onClick={() => window.location.href = `tel:${facility.phone}`}>
                📞 Call
              </button>
              {facility.type === 'doctor' && (
                <button className="action-btn book-btn">
                  📅 Book Appointment
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredFacilities.length === 0 && (
          <div className="no-results">
            <h3>No facilities found</h3>
            <p>Try increasing the search radius or changing filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;