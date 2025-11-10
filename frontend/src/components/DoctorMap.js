import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DoctorMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hospital/clinic icon
const hospitalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30"%3E%3Cpath fill="%23e74c3c" d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z"/%3E%3C/svg%3E',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// User location icon
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25"%3E%3Ccircle cx="12" cy="12" r="10" fill="%233498db" stroke="%23fff" stroke-width="2"/%3E%3Ccircle cx="12" cy="12" r="4" fill="%23fff"/%3E%3C/svg%3E',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const DoctorMap = ({ doctors, onDoctorSelect, userLocation, searchRadius = 10 }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [userPosition, setUserPosition] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setUserPosition([userLocation.lat, userLocation.lng]);
      filterDoctorsByDistance();
    } else {
      getCurrentLocation();
    }
  }, [userLocation, doctors, searchRadius]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserPosition([latitude, longitude]);
          filterDoctorsByDistance(latitude, longitude);
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Use default doctors if location fails
          setFilteredDoctors(doctors);
        }
      );
    } else {
      console.log("Geolocation not supported");
      setFilteredDoctors(doctors);
    }
  };

  const filterDoctorsByDistance = (userLat = userLocation?.lat, userLng = userLocation?.lng) => {
    if (!userLat || !userLng) {
      setFilteredDoctors(doctors);
      return;
    }

    const doctorsWithDistance = doctors.map(doctor => {
      // For demo purposes, generate random coordinates near major cities
      // In a real app, these would come from the database
      const doctorCoords = generateDoctorCoordinates(doctor);
      const distance = calculateDistance(userLat, userLng, doctorCoords.lat, doctorCoords.lng);
      
      return {
        ...doctor,
        coordinates: doctorCoords,
        distance: distance
      };
    });

    // Filter by search radius
    const nearby = doctorsWithDistance.filter(doctor => doctor.distance <= searchRadius);
    setFilteredDoctors(nearby.sort((a, b) => a.distance - b.distance));
  };

  const generateDoctorCoordinates = (doctor) => {
    // Generate coordinates based on doctor's city
    const cityCoords = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Miami': { lat: 25.7617, lng: -80.1918 },
      'Chicago': { lat: 41.8781, lng: -87.6298 }
    };

    const baseCoords = cityCoords[doctor.location.city] || cityCoords['New York'];
    
    // Add small random offset to simulate different clinic locations
    return {
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.1
    };
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (distance) => {
    return distance < 1 ? 
      `${(distance * 5280).toFixed(0)} ft` : 
      `${distance.toFixed(1)} mi`;
  };

  const renderStars = (rating) => {
    const average = rating.average || rating;
    return (
      <div className="star-rating-popup">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= average ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
        <span className="rating-text">({average})</span>
      </div>
    );
  };

  return (
    <div className="doctor-map-container">
      <div className="map-header">
        <h3>📍 Doctors Near You</h3>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-icon user-icon"></div>
            <span>Your Location</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon doctor-icon"></div>
            <span>Healthcare Providers</span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={12} 
        style={{ height: '400px', width: '100%' }}
        className="doctor-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* User location marker */}
        {userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>
              <div className="popup-content">
                <strong>📍 Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Doctor markers */}
        {filteredDoctors.map((doctor, index) => {
          if (!doctor.coordinates) return null;
          
          return (
            <Marker 
              key={doctor._id || index} 
              position={[doctor.coordinates.lat, doctor.coordinates.lng]}
              icon={hospitalIcon}
            >
              <Popup maxWidth={300}>
                <div className="doctor-popup">
                  <div className="popup-header">
                    <h4>Dr. {doctor.userId.name}</h4>
                    <span className="specialization">{doctor.specialization}</span>
                  </div>
                  
                  <div className="popup-details">
                    <div className="detail-row">
                      <strong>Experience:</strong> {doctor.experience} years
                    </div>
                    <div className="detail-row">
                      <strong>Fee:</strong> ${doctor.consultationFee}
                    </div>
                    <div className="detail-row">
                      <strong>Distance:</strong> {formatDistance(doctor.distance)}
                    </div>
                    <div className="detail-row">
                      <strong>Rating:</strong> {renderStars(doctor.rating)}
                    </div>
                    <div className="detail-row">
                      <strong>Location:</strong> {doctor.location.city}, {doctor.location.state}
                    </div>
                  </div>

                  <div className="popup-actions">
                    <button 
                      className="book-appointment-popup-btn"
                      onClick={() => onDoctorSelect && onDoctorSelect(doctor)}
                    >
                      📅 Book Appointment
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="map-summary">
        <p>
          {filteredDoctors.length > 0 ? (
            <>
              Found <strong>{filteredDoctors.length}</strong> healthcare provider{filteredDoctors.length !== 1 ? 's' : ''} 
              within <strong>{searchRadius}</strong> miles of your location
            </>
          ) : (
            <>No healthcare providers found within {searchRadius} miles. Try increasing the search radius.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default DoctorMap;