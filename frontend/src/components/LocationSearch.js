import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './LocationSearch.css';

const LocationSearch = ({ onLocationFound, currentLocation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsGeolocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address from coordinates
          const address = await reverseGeocode(latitude, longitude);
          
          onLocationFound({
            lat: latitude,
            lng: longitude,
            address: address,
            source: 'geolocation'
          });
          
          toast.success("Location found successfully!");
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          
          // Still provide coordinates even if address lookup fails
          onLocationFound({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            source: 'geolocation'
          });
          
          toast.success("Location found!");
        } finally {
          setIsGeolocationLoading(false);
        }
      },
      (error) => {
        setIsGeolocationLoading(false);
        let errorMessage = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        
        toast.error(errorMessage);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const searchByAddress = async () => {
    if (!searchInput.trim()) {
      toast.error("Please enter an address");
      return;
    }

    setIsAddressLoading(true);
    
    try {
      const coordinates = await geocodeAddress(searchInput);
      
      if (coordinates) {
        onLocationFound({
          lat: coordinates.lat,
          lng: coordinates.lng,
          address: searchInput,
          source: 'address'
        });
        
        toast.success("Address found successfully!");
        setSearchInput('');
      } else {
        toast.error("Address not found. Please try a different search.");
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error("Failed to find address. Please try again.");
    } finally {
      setIsAddressLoading(false);
    }
  };

  const geocodeAddress = async (address) => {
    // Using OpenStreetMap Nominatim API for geocoding (free alternative to Google)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding API request failed');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchByAddress();
    }
  };

  return (
    <div className="location-search">
      <div className="location-search-header">
        <h3>📍 Find Healthcare Near You</h3>
        <p>Use your current location or search by address</p>
      </div>

      <div className="location-methods">
        {/* Current Location Button */}
        <div className="location-method">
          <button
            className="current-location-btn"
            onClick={getCurrentLocation}
            disabled={isGeolocationLoading}
          >
            {isGeolocationLoading ? (
              <>
                <span className="loading-spinner"></span>
                Getting Location...
              </>
            ) : (
              <>
                📍 Use Current Location
              </>
            )}
          </button>
          <p className="method-description">
            Allow location access to find nearby doctors automatically
          </p>
        </div>

        <div className="location-divider">
          <span>OR</span>
        </div>

        {/* Address Search */}
        <div className="location-method">
          <div className="address-search">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Enter your address, city, or zip code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="address-input"
              />
              <button
                className="search-address-btn"
                onClick={searchByAddress}
                disabled={isAddressLoading || !searchInput.trim()}
              >
                {isAddressLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            <p className="method-description">
              Search by street address, city, state, or ZIP code
            </p>
          </div>
        </div>
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <div className="current-location-display">
          <div className="location-info">
            <h4>📍 Current Search Location:</h4>
            <p className="location-address">{currentLocation.address}</p>
            <div className="location-coordinates">
              <small>
                Coordinates: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="location-tips">
        <h4>💡 Tips for Better Results:</h4>
        <ul>
          <li>Allow location access for the most accurate nearby results</li>
          <li>Include city and state in address searches</li>
          <li>Try searching by ZIP code for quick results</li>
          <li>Check that location services are enabled in your browser</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationSearch;