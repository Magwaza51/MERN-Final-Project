const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    }
  },
  type: {
    type: String,
    enum: ['in-person', 'online', 'phone'],
    required: [true, 'Appointment type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: [true, 'Reason for visit is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  symptoms: [{
    type: String
  }],
  notes: {
    patient: {
      type: String,
      maxlength: [1000, 'Patient notes cannot exceed 1000 characters']
    },
    doctor: {
      type: String,
      maxlength: [1000, 'Doctor notes cannot exceed 1000 characters']
    }
  },
  prescription: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: {
    type: String,
    maxlength: [1000, 'Diagnosis cannot exceed 1000 characters']
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  consultationNotes: {
    type: String,
    default: ''
  },
  reminder: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  },
  meetingLink: {
    type: String // For online consultations
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    ratedAt: Date
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

// Virtual for appointment duration
appointmentSchema.virtual('duration').get(function() {
  const start = new Date(`2000-01-01 ${this.timeSlot.startTime}`);
  const end = new Date(`2000-01-01 ${this.timeSlot.endTime}`);
  return Math.round((end - start) / (1000 * 60)); // Duration in minutes
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canCancel = function() {
  const now = new Date();
  const appointmentTime = new Date(this.appointmentDate);
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return hoursUntilAppointment > 24 && this.status === 'confirmed';
};

// Method to send reminder
appointmentSchema.methods.sendReminder = function() {
  // This would integrate with email/SMS service
  this.reminder.sent = true;
  this.reminder.sentAt = new Date();
  return this.save();
};

// Pre-save middleware to generate meeting link for online appointments
appointmentSchema.pre('save', function(next) {
  if (this.type === 'online' && !this.meetingLink && this.status === 'confirmed') {
    // Generate meeting link (would integrate with video service like Zoom, Google Meet, etc.)
    this.meetingLink = `https://healthconnect.com/meeting/${this._id}`;
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);