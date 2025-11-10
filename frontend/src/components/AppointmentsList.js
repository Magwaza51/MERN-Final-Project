import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AppointmentsList.css';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Demo mode: Use mock appointments
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockAppointments = [
        {
          _id: 'appt-1',
          doctorName: 'Dr. Sarah Johnson',
          specialty: 'Cardiologist',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time: '10:30',
          status: 'confirmed',
          type: 'consultation'
        },
        {
          _id: 'appt-2',
          doctorName: 'Dr. Michael Chen',
          specialty: 'Neurologist',
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          time: '14:00',
          status: 'pending',
          type: 'follow-up'
        },
        {
          _id: 'appt-3',
          doctorName: 'Dr. Emily Davis',
          specialty: 'Dermatologist',
          date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          time: '09:00',
          status: 'confirmed',
          type: 'check-up'
        }
      ];
      
      setAppointments(mockAppointments);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalAppointments: mockAppointments.length
      });
      console.log('Demo mode: Mock appointments loaded');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus, notes = '') => {
    try {
      // Demo mode: Simulate status update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setAppointments(prev => prev.map(appt => 
        appt._id === appointmentId 
          ? { ...appt, status: newStatus, notes }
          : appt
      ));
      
      toast.success('Appointment status updated successfully (Demo Mode)');
      console.log('Demo mode: Status updated for appointment', appointmentId, 'to', newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update appointment status');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      // Demo mode: Simulate cancellation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setAppointments(prev => prev.map(appt => 
        appt._id === appointmentId 
          ? { ...appt, status: 'cancelled' }
          : appt
      ));
      
      toast.success('Appointment cancelled successfully (Demo Mode)');
      console.log('Demo mode: Appointment cancelled', appointmentId);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#3498db';
      case 'no-show': return '#95a5a6';
      default: return '#666';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'in-person': return '🏥';
      case 'online': return '💻';
      case 'phone': return '📞';
      default: return '📅';
    }
  };

  const canCancel = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff > 24 && appointment.status === 'pending';
  };

  return (
    <div className="appointments-list">
      <div className="appointments-header">
        <h2>My Appointments</h2>
        <p>Manage your scheduled appointments</p>
      </div>

      {/* Filters */}
      <div className="appointments-filters">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
          >
            <option value="">All Types</option>
            <option value="in-person">In-Person</option>
            <option value="online">Online</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Per Page</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="appointments-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found.</p>
            <p>Schedule your first appointment to get started!</p>
          </div>
        ) : (
          <>
            <div className="appointments-grid">
              {appointments.map(appointment => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-type">
                      <span className="type-icon">{getTypeIcon(appointment.type)}</span>
                      <span className="type-text">{appointment.type.replace('-', ' ')}</span>
                    </div>
                    <div 
                      className="appointment-status"
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status}
                    </div>
                  </div>

                  <div className="appointment-details">
                    <h3>
                      {appointment.doctorId ? 
                        `Dr. ${appointment.doctorId.userId.name}` : 
                        `Patient: ${appointment.patientId.name}`
                      }
                    </h3>
                    
                    {appointment.doctorId && (
                      <p className="specialization">{appointment.doctorId.specialization}</p>
                    )}

                    <div className="appointment-datetime">
                      <div className="date">
                        📅 {formatDate(appointment.appointmentDate)}
                      </div>
                      <div className="time">
                        🕐 {formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}
                      </div>
                    </div>

                    <div className="appointment-info">
                      <div className="reason">
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                      
                      {appointment.symptoms && appointment.symptoms.length > 0 && (
                        <div className="symptoms">
                          <strong>Symptoms:</strong> {appointment.symptoms.join(', ')}
                        </div>
                      )}

                      {appointment.consultationFee && (
                        <div className="fee">
                          <strong>Fee:</strong> ${appointment.consultationFee}
                        </div>
                      )}
                    </div>

                    {appointment.notes && (appointment.notes.patient || appointment.notes.doctor) && (
                      <div className="notes">
                        {appointment.notes.patient && (
                          <div className="patient-notes">
                            <strong>Patient Notes:</strong> {appointment.notes.patient}
                          </div>
                        )}
                        {appointment.notes.doctor && (
                          <div className="doctor-notes">
                            <strong>Doctor Notes:</strong> {appointment.notes.doctor}
                          </div>
                        )}
                      </div>
                    )}

                    {appointment.prescription && appointment.prescription.length > 0 && (
                      <div className="prescription">
                        <strong>Prescription:</strong>
                        <ul>
                          {appointment.prescription.map((med, index) => (
                            <li key={index}>
                              {med.medication} - {med.dosage} ({med.frequency})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="appointment-actions">
                    {canCancel(appointment) && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel Appointment
                      </button>
                    )}
                    
                    {appointment.status === 'pending' && appointment.doctorId && (
                      <button
                        className="confirm-btn"
                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                      >
                        Confirm
                      </button>
                    )}

                    {appointment.type === 'online' && appointment.status === 'confirmed' && (
                      <button className="join-btn">
                        Join Video Call
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={pagination.current === 1}
                onClick={() => setFilters({ ...filters, page: pagination.current - 1 })}
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {pagination.current} of {pagination.pages} ({pagination.total} total)
              </span>
              
              <button
                disabled={pagination.current === pagination.pages}
                onClick={() => setFilters({ ...filters, page: pagination.current + 1 })}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;