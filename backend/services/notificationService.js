const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to your preferred email service
      auth: {
        user: process.env.EMAIL_USER || 'healthconnect@example.com',
        pass: process.env.EMAIL_PASS || 'your-app-password' // Use app password for Gmail
      }
    });

    // Start the reminder scheduler
    this.startReminderScheduler();
  }

  // Send appointment confirmation email
  async sendAppointmentConfirmation(appointment) {
    try {
      const patient = await User.findById(appointment.patientId);
      const doctor = await Doctor.findById(appointment.doctorId).populate('userId');
      
      if (!patient || !doctor) {
        throw new Error('Patient or doctor not found');
      }

      const emailContent = this.generateConfirmationEmail(appointment, patient, doctor);
      
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'healthconnect@example.com',
        to: patient.email,
        subject: 'Appointment Confirmation - HealthConnect',
        html: emailContent
      });

      console.log(`Confirmation email sent to ${patient.email}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }

  // Send appointment reminder email
  async sendAppointmentReminder(appointment) {
    try {
      const patient = await User.findById(appointment.patientId);
      const doctor = await Doctor.findById(appointment.doctorId).populate('userId');
      
      if (!patient || !doctor) {
        throw new Error('Patient or doctor not found');
      }

      const emailContent = this.generateReminderEmail(appointment, patient, doctor);
      
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'healthconnect@example.com',
        to: patient.email,
        subject: 'Appointment Reminder - HealthConnect',
        html: emailContent
      });

      console.log(`Reminder email sent to ${patient.email}`);
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  }

  // Send appointment cancellation email
  async sendAppointmentCancellation(appointment, cancelledBy = 'patient') {
    try {
      const patient = await User.findById(appointment.patientId);
      const doctor = await Doctor.findById(appointment.doctorId).populate('userId');
      
      if (!patient || !doctor) {
        throw new Error('Patient or doctor not found');
      }

      const emailContent = this.generateCancellationEmail(appointment, patient, doctor, cancelledBy);
      
      // Send to patient
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'healthconnect@example.com',
        to: patient.email,
        subject: 'Appointment Cancelled - HealthConnect',
        html: emailContent
      });

      // Send to doctor if cancelled by patient
      if (cancelledBy === 'patient') {
        await this.transporter.sendMail({
          from: process.env.EMAIL_USER || 'healthconnect@example.com',
          to: doctor.userId.email,
          subject: 'Appointment Cancelled by Patient - HealthConnect',
          html: this.generateDoctorCancellationEmail(appointment, patient, doctor)
        });
      }

      console.log(`Cancellation emails sent for appointment ${appointment._id}`);
    } catch (error) {
      console.error('Error sending cancellation email:', error);
    }
  }

  // Generate confirmation email content
  generateConfirmationEmail(appointment, patient, doctor) {
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const startTime = new Date(`2000-01-01 ${appointment.timeSlot.startTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .label { font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 HealthConnect</h1>
            <h2>Appointment Confirmation</h2>
          </div>
          <div class="content">
            <p>Dear ${patient.name},</p>
            <p>Your appointment has been successfully booked! Here are the details:</p>
            
            <div class="appointment-details">
              <div class="detail-row">
                <span class="label">Doctor:</span>
                <span>Dr. ${doctor.userId.name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Specialization:</span>
                <span>${doctor.specialization}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span>${appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span>${startTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">Type:</span>
                <span>${appointment.type}</span>
              </div>
              <div class="detail-row">
                <span class="label">Consultation Fee:</span>
                <span>$${appointment.consultationFee}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location:</span>
                <span>${doctor.location.address}, ${doctor.location.city}, ${doctor.location.state}</span>
              </div>
            </div>

            <p><strong>Reason for visit:</strong> ${appointment.reason}</p>
            
            <p>Please arrive 15 minutes early for your appointment. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
            
            <p>Best regards,<br>The HealthConnect Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message from HealthConnect. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate reminder email content
  generateReminderEmail(appointment, patient, doctor) {
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const startTime = new Date(`2000-01-01 ${appointment.timeSlot.startTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .reminder-badge { background: #e74c3c; color: white; padding: 10px; border-radius: 8px; text-align: center; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 HealthConnect</h1>
            <h2>Appointment Reminder</h2>
          </div>
          <div class="content">
            <div class="reminder-badge">
              <strong>⏰ Your appointment is tomorrow!</strong>
            </div>
            
            <p>Dear ${patient.name},</p>
            <p>This is a friendly reminder about your upcoming appointment:</p>
            
            <div class="appointment-details">
              <p><strong>Doctor:</strong> Dr. ${doctor.userId.name}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Type:</strong> ${appointment.type}</p>
              <p><strong>Location:</strong> ${doctor.location.address}, ${doctor.location.city}</p>
            </div>
            
            <p>Please remember to:</p>
            <ul>
              <li>Arrive 15 minutes early</li>
              <li>Bring a valid ID and insurance card</li>
              <li>Bring any relevant medical records</li>
              <li>Prepare a list of questions for your doctor</li>
            </ul>
            
            <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <p>Best regards,<br>The HealthConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate cancellation email content
  generateCancellationEmail(appointment, patient, doctor, cancelledBy) {
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 HealthConnect</h1>
            <h2>Appointment Cancelled</h2>
          </div>
          <div class="content">
            <p>Dear ${patient.name},</p>
            <p>Your appointment has been cancelled ${cancelledBy === 'doctor' ? 'by the doctor' : 'as requested'}.</p>
            
            <div class="appointment-details">
              <p><strong>Doctor:</strong> Dr. ${doctor.userId.name}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointment.timeSlot.startTime}</p>
            </div>
            
            <p>If you would like to reschedule, please visit our website or contact us.</p>
            
            <p>Best regards,<br>The HealthConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate doctor cancellation notification
  generateDoctorCancellationEmail(appointment, patient, doctor) {
    return `
      <h2>Appointment Cancellation Notice</h2>
      <p>Dear Dr. ${doctor.userId.name},</p>
      <p>Patient ${patient.name} has cancelled their appointment scheduled for ${new Date(appointment.appointmentDate).toLocaleDateString()}.</p>
      <p>The time slot is now available for other bookings.</p>
    `;
  }

  // Start the appointment reminder scheduler
  startReminderScheduler() {
    // Run every hour to check for appointments that need reminders
    cron.schedule('0 * * * *', async () => {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        // Find appointments scheduled for tomorrow that haven't been reminded yet
        const appointmentsToRemind = await Appointment.find({
          appointmentDate: {
            $gte: tomorrow,
            $lt: dayAfterTomorrow
          },
          status: { $in: ['pending', 'confirmed'] },
          reminderSent: { $ne: true }
        });

        console.log(`Found ${appointmentsToRemind.length} appointments to remind`);

        for (const appointment of appointmentsToRemind) {
          await this.sendAppointmentReminder(appointment);
          
          // Mark reminder as sent
          appointment.reminderSent = true;
          await appointment.save();
        }
      } catch (error) {
        console.error('Error in reminder scheduler:', error);
      }
    });

    console.log('Appointment reminder scheduler started');
  }
}

module.exports = new NotificationService();