import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/responsive.css';
import { AuthProvider } from './context/AuthContext';
// import { SocketProvider } from './context/SocketContext';
// import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import SidebarLayout from './components/SidebarLayout';
import Home from './pages/Home';
import ProductionHome from './pages/ProductionHome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import DoctorProfile from './pages/DoctorProfile';
import MedicationTracker from './pages/MedicationTracker';
import WellnessTracker from './pages/WellnessTracker';
import HealthAnalytics from './pages/HealthAnalytics';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SocketDemo from './components/SocketDemo';
import MedicalRecords from './components/MedicalRecords';
import AdvancedAppointments from './components/AdvancedAppointments';
import AIHealthAssistant from './components/AIHealthAssistant';
import TelemedicineConsultation from './components/TelemedicineConsultation';
import EmergencySystem from './components/EmergencySystem';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <div className="App">
              <Routes>
                {/* Public routes without sidebar */}
                <Route path="/" element={<ProductionHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes with sidebar */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Health Dashboard">
                        <Dashboard />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/doctors" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Find Doctors">
                        <Doctors />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/doctors/:doctorId" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Doctor Profile">
                        <DoctorProfile />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/appointments" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="My Appointments">
                        <Appointments />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/medications" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="💊 Medication Tracker">
                        <MedicationTracker />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/wellness" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="🌟 Wellness Tracker">
                        <WellnessTracker />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/advanced-appointments" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Smart Appointments">
                        <AdvancedAppointments />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/medical-records" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Medical Records">
                        <MedicalRecords />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/ai-assistant" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="AI Health Assistant">
                        <AIHealthAssistant />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/telemedicine" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Telemedicine">
                        <TelemedicineConsultation />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/emergency" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="🚨 Emergency System">
                        <EmergencySystem />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="📊 Health Analytics">
                        <HealthAnalytics />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/socket-demo" 
                  element={
                    <PrivateRoute>
                      <SidebarLayout title="Socket Demo">
                        <SocketDemo />
                      </SidebarLayout>
                    </PrivateRoute>
                  } 
                />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </Router>
    </AuthProvider>
  );
}

export default App;