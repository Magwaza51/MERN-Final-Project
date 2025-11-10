const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['blood_pressure', 'blood_sugar', 'heart_rate', 'weight', 'temperature', 'oxygen_saturation']
  },
  value: {
    systolic: { type: Number }, // for blood pressure
    diastolic: { type: Number }, // for blood pressure
    level: { type: Number }, // for blood sugar, heart rate, weight, temperature, oxygen saturation
    unit: { type: String, required: true } // mmHg, mg/dL, bpm, kg, °C, %
  },
  recordedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isNormal: {
    type: Boolean,
    default: true
  },
  deviceUsed: {
    type: String,
    default: 'Manual Entry'
  }
}, {
  timestamps: true
});

// Method to determine if reading is normal
healthRecordSchema.methods.checkIfNormal = function() {
  const { type, value } = this;
  
  switch (type) {
    case 'blood_pressure':
      // Normal: Systolic < 120 AND Diastolic < 80
      this.isNormal = value.systolic < 120 && value.diastolic < 80;
      break;
    case 'blood_sugar':
      // Normal fasting: 70-99 mg/dL
      this.isNormal = value.level >= 70 && value.level <= 99;
      break;
    case 'heart_rate':
      // Normal resting: 60-100 bpm
      this.isNormal = value.level >= 60 && value.level <= 100;
      break;
    case 'weight':
      // This would need user's target weight range
      this.isNormal = true; // Default to true, can be customized
      break;
    case 'temperature':
      // Normal: 97-99°F (36.1-37.2°C)
      this.isNormal = value.level >= 36.1 && value.level <= 37.2;
      break;
    case 'oxygen_saturation':
      // Normal: 95-100%
      this.isNormal = value.level >= 95 && value.level <= 100;
      break;
    default:
      this.isNormal = true;
  }
  
  return this.isNormal;
};

// Pre-save middleware to check if reading is normal
healthRecordSchema.pre('save', function(next) {
  this.checkIfNormal();
  next();
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);