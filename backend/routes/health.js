const express = require('express');
const { body, validationResult } = require('express-validator');
const HealthRecord = require('../models/HealthRecord');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// Add new health record
router.post('/', authenticateToken, [
  body('type').isIn(['blood_pressure', 'blood_sugar', 'heart_rate', 'weight', 'temperature', 'oxygen_saturation'])
    .withMessage('Invalid health record type'),
  body('value').isObject().withMessage('Value must be an object'),
  body('value.unit').notEmpty().withMessage('Unit is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, value, notes, deviceUsed, recordedAt } = req.body;

    // Validate value structure based on type
    if (type === 'blood_pressure') {
      if (!value.systolic || !value.diastolic) {
        return res.status(400).json({ message: 'Blood pressure requires systolic and diastolic values' });
      }
    } else {
      if (!value.level) {
        return res.status(400).json({ message: 'Health record requires a level value' });
      }
    }

    const healthRecord = new HealthRecord({
      userId: req.user._id,
      type,
      value,
      notes,
      deviceUsed,
      recordedAt: recordedAt || new Date()
    });

    await healthRecord.save();

    res.status(201).json({
      message: 'Health record added successfully',
      record: healthRecord,
      isNormal: healthRecord.isNormal
    });
  } catch (error) {
    console.error('Health record creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's health records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, startDate, endDate, limit = 50 } = req.query;
    
    let query = { userId: req.user._id };
    
    if (type) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate);
      if (endDate) query.recordedAt.$lte = new Date(endDate);
    }

    const records = await HealthRecord.find(query)
      .sort({ recordedAt: -1 })
      .limit(parseInt(limit));

    // Get summary statistics
    const summary = await HealthRecord.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          normalCount: { $sum: { $cond: ['$isNormal', 1, 0] } },
          abnormalCount: { $sum: { $cond: ['$isNormal', 0, 1] } },
          lastReading: { $max: '$recordedAt' }
        }
      }
    ]);

    res.json({
      records,
      summary,
      totalRecords: records.length
    });
  } catch (error) {
    console.error('Health records fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get health analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { type, period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = {
      userId: req.user._id,
      recordedAt: { $gte: startDate }
    };

    if (type) {
      query.type = type;
    }

    const records = await HealthRecord.find(query).sort({ recordedAt: 1 });

    // Calculate trends and averages
    const analytics = records.reduce((acc, record) => {
      if (!acc[record.type]) {
        acc[record.type] = {
          readings: [],
          normalCount: 0,
          abnormalCount: 0,
          average: 0
        };
      }

      acc[record.type].readings.push({
        date: record.recordedAt,
        value: record.value,
        isNormal: record.isNormal
      });

      if (record.isNormal) {
        acc[record.type].normalCount++;
      } else {
        acc[record.type].abnormalCount++;
      }

      return acc;
    }, {});

    // Calculate averages
    Object.keys(analytics).forEach(type => {
      const readings = analytics[type].readings;
      if (type === 'blood_pressure') {
        const avgSystolic = readings.reduce((sum, r) => sum + r.value.systolic, 0) / readings.length;
        const avgDiastolic = readings.reduce((sum, r) => sum + r.value.diastolic, 0) / readings.length;
        analytics[type].average = { systolic: avgSystolic, diastolic: avgDiastolic };
      } else {
        const avgLevel = readings.reduce((sum, r) => sum + r.value.level, 0) / readings.length;
        analytics[type].average = avgLevel;
      }
    });

    res.json({
      period: `${days} days`,
      analytics
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete health record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!record) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    await HealthRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Health record deleted successfully' });
  } catch (error) {
    console.error('Health record deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;