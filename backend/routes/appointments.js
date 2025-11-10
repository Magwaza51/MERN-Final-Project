const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const notificationService = require('../services/notificationService');
const socketService = require('../services/socketService');

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

// Book a new appointment
router.post('/', authenticateToken, [
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('timeSlot.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required'),
  body('timeSlot.endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required'),
  body('type').isIn(['in-person', 'online', 'phone']).withMessage('Valid appointment type is required'),
  body('reason').isLength({ min: 5, max: 500 }).withMessage('Reason must be between 5 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId, appointmentDate, timeSlot, type, reason, symptoms, notes } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lt: new Date(appointmentDate).setHours(23, 59, 59, 999)
      },
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      appointmentDate: appointmentDateTime,
      timeSlot,
      type,
      reason,
      symptoms: symptoms || [],
      notes: {
        patient: notes || ''
      },
      consultationFee: doctor.consultationFee
    });

    await appointment.save();

    // Send confirmation email
    try {
      await notificationService.sendAppointmentConfirmation(appointment);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the appointment creation if email fails
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'userId specialization consultationFee location')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    // Send real-time notifications via Socket.io
    try {
      const doctorUser = await User.findById(doctor.userId);
      
      // Notify doctor about new appointment
      socketService.notifyAppointmentBooked(
        doctor.userId,
        req.user._id,
        {
          appointmentId: appointment._id,
          patientName: req.user.name,
          doctorName: doctorUser.name,
          date: appointmentDate,
          time: timeSlot.startTime,
          type: type,
          reason: reason
        }
      );

      // Send confirmation to patient
      socketService.emitToUser(req.user._id, 'appointment_confirmed', {
        type: 'appointment_confirmed',
        title: 'Appointment Confirmed',
        message: `Your appointment with Dr. ${doctorUser.name} has been confirmed for ${appointmentDate.toLocaleDateString()}`,
        appointmentId: appointment._id,
        priority: 'medium'
      });

    } catch (socketError) {
      console.error('Failed to send real-time notifications:', socketError);
      // Don't fail the appointment creation if socket notifications fail
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's appointments
router.get('/my-appointments', authenticateToken, [
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']),
  query('type').optional().isIn(['in-person', 'online', 'phone']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by user role
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      query.doctorId = doctor._id;
    } else {
      query.patientId = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email profile.phone')
      .populate('doctorId', 'userId specialization consultationFee location')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email profile')
      .populate('doctorId', 'userId specialization consultationFee location')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has access to this appointment
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const isPatient = appointment.patientId._id.toString() === req.user._id.toString();
    const isDoctor = doctor && appointment.doctorId._id.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Appointment fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (for doctors)
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'no-show']).withMessage('Valid status is required'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the assigned doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    if (notes) {
      appointment.notes.doctor = notes;
    }

    await appointment.save();

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Appointment status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to cancel
    const doctor = await Doctor.findOne({ userId: req.user._id });
    const isPatient = appointment.patientId.toString() === req.user._id.toString();
    const isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if appointment can be cancelled
    if (!appointment.canCancel()) {
      return res.status(400).json({ 
        message: 'Appointment cannot be cancelled less than 24 hours before the scheduled time' 
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Send cancellation email
    try {
      await notificationService.sendAppointmentCancellation(appointment, 'patient');
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Appointment cancellation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add prescription (for doctors)
router.post('/:id/prescription', authenticateToken, [
  body('prescription').isArray().withMessage('Prescription must be an array'),
  body('prescription.*.medication').notEmpty().withMessage('Medication name is required'),
  body('prescription.*.dosage').notEmpty().withMessage('Dosage is required'),
  body('prescription.*.frequency').notEmpty().withMessage('Frequency is required'),
  body('diagnosis').optional().isLength({ max: 1000 }).withMessage('Diagnosis cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prescription, diagnosis, followUpRequired, followUpDate } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the assigned doctor
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.prescription = prescription;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (followUpRequired !== undefined) appointment.followUpRequired = followUpRequired;
    if (followUpDate) appointment.followUpDate = new Date(followUpDate);

    await appointment.save();

    res.json({
      message: 'Prescription added successfully',
      appointment
    });
  } catch (error) {
    console.error('Prescription add error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/doctors/:doctorId/slots', [
  query('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Get doctor's availability for the day
    const dayAvailability = doctor.availability.find(av => av.day === dayOfWeek && av.isAvailable);
    
    if (!dayAvailability) {
      return res.json({ availableSlots: [] });
    }

    // Get existing appointments for the date
    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    // Generate available time slots
    const bookedSlots = existingAppointments.map(apt => apt.timeSlot.startTime);
    const availableSlots = generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime, 30) // 30-minute slots
      .filter(slot => !bookedSlots.includes(slot.startTime));

    res.json({ availableSlots });
  } catch (error) {
    console.error('Time slots fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, duration) {
  const slots = [];
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  let current = new Date(start);
  
  while (current < end) {
    const slotEnd = new Date(current.getTime() + duration * 60000);
    if (slotEnd <= end) {
      slots.push({
        startTime: current.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5)
      });
    }
    current = slotEnd;
  }
  
  return slots;
}

module.exports = router;