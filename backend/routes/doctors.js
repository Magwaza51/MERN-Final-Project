const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Register as doctor
router.post('/register', authenticateToken, [
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.zipCode').notEmpty().withMessage('Zip code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is already registered as doctor
    const existingDoctor = await Doctor.findOne({ userId: req.user._id });
    if (existingDoctor) {
      return res.status(400).json({ message: 'User is already registered as a doctor' });
    }

    // Check if license number already exists
    const existingLicense = await Doctor.findOne({ licenseNumber: req.body.licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'License number already registered' });
    }

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });

    // Create doctor profile
    const doctor = new Doctor({
      userId: req.user._id,
      ...req.body
    });

    await doctor.save();

    const populatedDoctor = await Doctor.findById(doctor._id).populate('userId', 'name email');

    res.status(201).json({
      message: 'Doctor profile created successfully',
      doctor: populatedDoctor
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctors with filtering and search
router.get('/', [
  query('city').optional().isString(),
  query('specialization').optional().isString(),
  query('search').optional().isString(),
  query('latitude').optional().isFloat(),
  query('longitude').optional().isFloat(),
  query('radius').optional().isFloat({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      city,
      specialization,
      search,
      latitude,
      longitude,
      radius = 25, // Default radius in km
      page = 1,
      limit = 10
    } = req.query;

    let query = { isVerified: true };

    // Filter by city
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    // Filter by specialization
    if (specialization) {
      query.specialization = specialization;
    }

    // Search by name or specialization
    if (search) {
      query.$or = [
        { specialization: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') }
      ];
    }

    // Location-based search
    if (latitude && longitude) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email profile.phone')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    res.json({
      doctors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Doctors fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email profile.phone createdAt');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ doctor });
  } catch (error) {
    console.error('Doctor fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    res.json({
      message: 'Doctor profile updated successfully',
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error('Doctor update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's availability
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availability');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ availability: doctor.availability });
  } catch (error) {
    console.error('Availability fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor's availability
router.put('/availability', authenticateToken, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctor.availability = req.body.availability;
    await doctor.save();

    res.json({
      message: 'Availability updated successfully',
      availability: doctor.availability
    });
  } catch (error) {
    console.error('Availability update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specializations list
router.get('/meta/specializations', (req, res) => {
  const specializations = [
    'General Practitioner',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Orthopedist',
    'Psychiatrist',
    'Gynecologist',
    'Endocrinologist',
    'Ophthalmologist',
    'ENT Specialist',
    'Urologist',
    'Other'
  ];

  res.json({ specializations });
});

// Get nearby doctors based on location
router.get('/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  query('radius').optional().isFloat({ min: 1, max: 100 }).withMessage('Radius must be between 1 and 100 miles'),
  query('specialization').optional(),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lat, lng, radius = 10, specialization, limit = 20 } = req.query;
    
    // Build query for location-based search
    let query = {
      'location.coordinates.latitude': { $exists: true },
      'location.coordinates.longitude': { $exists: true }
    };

    // Add specialization filter if provided
    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    // Find doctors and calculate distances
    const doctors = await Doctor.find(query)
      .populate('userId', 'name email')
      .limit(parseInt(limit) * 2); // Get more to filter by distance

    // Calculate distances and filter by radius
    const nearbyDoctors = doctors
      .map(doctor => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          doctor.location.coordinates.latitude,
          doctor.location.coordinates.longitude
        );
        
        return {
          ...doctor.toObject(),
          distance: distance
        };
      })
      .filter(doctor => doctor.distance <= parseFloat(radius))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit));

    res.json({
      doctors: nearbyDoctors,
      searchParams: {
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: parseFloat(radius),
        specialization: specialization || null
      },
      total: nearbyDoctors.length
    });
  } catch (error) {
    console.error('Nearby doctors search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;