import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [emergencyQR, setEmergencyQR] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMedicalRecords();
    generateEmergencyQR();
  }, []);

  const loadMedicalRecords = async () => {
    // Use mock medical records for demo
    setRecords([
      {
        _id: '1',
        patientName: 'Demo Patient',
        date: '2025-10-25',
        diagnosis: 'Annual Health Checkup',
        medications: ['Vitamin D3', 'Multivitamin'],
        vitals: {
          bloodPressure: '120/80',
          heartRate: '72 bpm',
          temperature: '98.6°F',
          weight: '70 kg'
        },
        notes: 'Patient in good health. Continue current wellness routine.',
        doctor: 'Dr. Sarah Johnson',
        medicalHistory: ['No significant medical history'],
        allergies: ['None known']
      },
      {
        _id: '2',
        patientName: 'Demo Patient',
        date: '2025-09-15',
        diagnosis: 'Routine Blood Work',
        medications: ['Iron supplement'],
        vitals: {
          bloodPressure: '118/78',
          heartRate: '68 bpm',
          temperature: '98.4°F',
          weight: '69.5 kg'
        },
        notes: 'Blood work shows normal values. Continue iron supplement.',
        doctor: 'Dr. Michael Chen',
        medicalHistory: ['Mild iron deficiency'],
        allergies: ['None known']
      }
    ]);
  };

  const generateEmergencyQR = async () => {
    // Use mock emergency QR data for demo
    setEmergencyQR({
      patientId: 'DEMO-001',
      name: 'Demo Patient',
      bloodType: 'O+',
      allergies: ['None known'],
      medications: ['Vitamin D3', 'Multivitamin'],
      emergencyContacts: [
        { name: 'Emergency Contact', phone: '+1-555-0123', relation: 'Family' }
      ],
      medicalConditions: ['None'],
      lastUpdated: new Date().toISOString()
    });
  };

  const downloadMedicalRecord = (record) => {
    const recordData = {
      id: record._id,
      patient: record.patientName,
      date: record.date,
      diagnosis: record.diagnosis,
      medications: record.medications,
      vitals: record.vitals,
      notes: record.notes,
      doctor: record.doctor,
      facility: record.facility
    };

    const blob = new Blob([JSON.stringify(recordData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-record-${record.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareRecord = (record) => {
    const shareData = {
      recordId: record._id,
      patientId: record.patientId,
      accessKey: generateAccessKey(),
      expiresIn: '24h'
    };

    setSelectedRecord(shareData);
    setShowQRCode(true);
  };

  const generateAccessKey = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const filteredRecords = records.filter(record =>
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.medications?.some(med => 
      med.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="medical-records">
      <div className="records-header">
        <h2>📋 Medical Records</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="emergency-qr-btn"
            onClick={() => setShowQRCode(!showQRCode)}
          >
            🚨 Emergency QR
          </button>
        </div>
      </div>

      {showQRCode && emergencyQR && (
        <div className="qr-modal">
          <div className="qr-content">
            <h3>Emergency Medical Information QR Code</h3>
            <div className="qr-code-container">
              <QRCodeSVG
                value={JSON.stringify(emergencyQR)}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={true}
              />
            </div>
            <p>Save this QR code for emergency situations. First responders can scan it to access your critical medical information.</p>
            <div className="emergency-info">
              <h4>Information Included:</h4>
              <ul>
                <li>Blood Type: {emergencyQR.bloodType}</li>
                <li>Allergies: {emergencyQR.allergies?.join(', ')}</li>
                <li>Medical Conditions: {emergencyQR.conditions?.join(', ')}</li>
                <li>Emergency Contacts: {emergencyQR.emergencyContacts?.length} contacts</li>
                <li>Current Medications: {emergencyQR.medications?.length} medications</li>
              </ul>
            </div>
            <div className="qr-actions">
              <button onClick={() => window.print()}>🖨️ Print QR Code</button>
              <button onClick={() => setShowQRCode(false)}>✕ Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="records-stats">
        <div className="stat-card">
          <h4>Total Records</h4>
          <p>{records.length}</p>
        </div>
        <div className="stat-card">
          <h4>Last Visit</h4>
          <p>{records[0]?.date || 'No visits'}</p>
        </div>
        <div className="stat-card">
          <h4>Active Medications</h4>
          <p>{emergencyQR?.medications?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h4>Known Allergies</h4>
          <p>{emergencyQR?.allergies?.length || 0}</p>
        </div>
      </div>

      <div className="records-list">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <div key={record._id} className="record-card">
              <div className="record-header">
                <div className="record-date">
                  📅 {new Date(record.date).toLocaleDateString()}
                </div>
                <div className="record-priority">
                  <span className={`priority ${record.priority || 'normal'}`}>
                    {record.priority || 'Normal'}
                  </span>
                </div>
              </div>

              <div className="record-content">
                <div className="primary-info">
                  <h4>{record.diagnosis || 'General Checkup'}</h4>
                  <p><strong>Doctor:</strong> {record.doctor || 'Dr. Unknown'}</p>
                  <p><strong>Facility:</strong> {record.facility || 'Healthcare Facility'}</p>
                </div>

                <div className="vitals-section">
                  <h5>Vital Signs</h5>
                  <div className="vitals-grid">
                    <div className="vital">
                      <span>BP</span>
                      <strong>{record.vitals?.bloodPressure || 'N/A'}</strong>
                    </div>
                    <div className="vital">
                      <span>HR</span>
                      <strong>{record.vitals?.heartRate || 'N/A'} bpm</strong>
                    </div>
                    <div className="vital">
                      <span>Temp</span>
                      <strong>{record.vitals?.temperature || 'N/A'}°C</strong>
                    </div>
                    <div className="vital">
                      <span>O2</span>
                      <strong>{record.vitals?.oxygenSaturation || 'N/A'}%</strong>
                    </div>
                  </div>
                </div>

                {record.medications && record.medications.length > 0 && (
                  <div className="medications-section">
                    <h5>Medications Prescribed</h5>
                    <div className="medications-list">
                      {record.medications.map((med, index) => (
                        <span key={index} className="medication-tag">
                          💊 {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.notes && (
                  <div className="notes-section">
                    <h5>Notes</h5>
                    <p>{record.notes}</p>
                  </div>
                )}
              </div>

              <div className="record-actions">
                <button 
                  onClick={() => shareRecord(record)}
                  className="action-btn share"
                >
                  📤 Share
                </button>
                <button 
                  onClick={() => downloadMedicalRecord(record)}
                  className="action-btn download"
                >
                  📥 Download
                </button>
                <button className="action-btn view">
                  👁️ View Full
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-records">
            <div className="no-records-icon">📋</div>
            <h3>No Medical Records Found</h3>
            <p>Your medical records will appear here when they're added by healthcare providers.</p>
            <button className="add-record-btn">
              ➕ Request Records Import
            </button>
          </div>
        )}
      </div>

      <style>{`
        .medical-records {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .records-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .search-input {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 25px;
          width: 250px;
          font-size: 14px;
        }

        .emergency-qr-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
        }

        .qr-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .qr-content {
          background: white;
          padding: 30px;
          border-radius: 15px;
          max-width: 500px;
          text-align: center;
        }

        .qr-code-container {
          margin: 20px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .emergency-info {
          text-align: left;
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .emergency-info ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .qr-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .qr-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .qr-actions button:first-child {
          background: #4f46e5;
          color: white;
        }

        .qr-actions button:last-child {
          background: #6c757d;
          color: white;
        }

        .records-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stat-card h4 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }

        .stat-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
        }

        .records-list {
          display: grid;
          gap: 20px;
        }

        .record-card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-left: 4px solid #4f46e5;
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .record-date {
          font-weight: bold;
          color: #666;
        }

        .priority {
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }

        .priority.normal {
          background: #d4edda;
          color: #155724;
        }

        .priority.urgent {
          background: #f8d7da;
          color: #721c24;
        }

        .priority.critical {
          background: #dc3545;
          color: white;
        }

        .record-content {
          margin-bottom: 20px;
        }

        .primary-info h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 18px;
        }

        .primary-info p {
          margin: 5px 0;
          color: #666;
        }

        .vitals-section {
          margin: 20px 0;
        }

        .vitals-section h5 {
          margin: 0 0 10px 0;
          color: #4f46e5;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
        }

        .vital {
          text-align: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .vital span {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .vital strong {
          font-size: 16px;
          color: #333;
        }

        .medications-section {
          margin: 20px 0;
        }

        .medications-section h5 {
          margin: 0 0 10px 0;
          color: #4f46e5;
        }

        .medications-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .medication-tag {
          background: #e7f3ff;
          color: #0066cc;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 13px;
        }

        .notes-section {
          margin: 20px 0;
        }

        .notes-section h5 {
          margin: 0 0 10px 0;
          color: #4f46e5;
        }

        .notes-section p {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 0;
          line-height: 1.5;
        }

        .record-actions {
          display: flex;
          gap: 10px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .action-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .action-btn.share {
          background: #28a745;
          color: white;
        }

        .action-btn.download {
          background: #17a2b8;
          color: white;
        }

        .action-btn.view {
          background: #6c757d;
          color: white;
        }

        .no-records {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .no-records-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .no-records h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .no-records p {
          color: #666;
          margin-bottom: 30px;
        }

        .add-record-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MedicalRecords;