# HealthTracker - SDG 3: Good Health and Well-Being

This is a comprehensive MERN stack health monitoring application supporting UN Sustainable Development Goal 3.

## Project Overview
A complete health tracking platform that empowers users to monitor vital health metrics, visualize trends, and make informed wellness decisions.

## Project Structure
- `backend/` - Node.js/Express.js server with MongoDB
  - `models/` - User and HealthRecord schemas
  - `routes/` - Authentication, user management, and health data APIs
- `frontend/` - React.js application with health tracking features
  - `components/` - HealthDashboard, HealthRecordForm, HealthMetricCard, HealthGoals, HealthTips
  - `pages/` - Home, Login, Register, Dashboard
  - `context/` - Authentication state management
- Configuration files for development environment

## Health Metrics Supported
- Blood Pressure (systolic/diastolic)
- Blood Sugar (mg/dL)
- Heart Rate (bpm)
- Weight (kg)
- Body Temperature (°C)
- Oxygen Saturation (%)

## Key Features
- **Health Data Entry**: Easy-to-use forms for recording health metrics
- **Visual Analytics**: Charts and graphs showing health trends
- **Smart Alerts**: Automatic detection of abnormal readings
- **Health Goals**: Personal health target setting and tracking
- **Health Tips**: Evidence-based health recommendations
- **Quick Metrics**: Dashboard cards showing latest readings
- **Multi-tab Interface**: Dashboard, Goals, and Tips sections
- **Responsive Design**: Works on desktop and mobile devices

## Development Guidelines
- Use ES6+ JavaScript features
- Follow RESTful API design patterns
- Implement proper error handling and validation
- Use environment variables for configuration
- Follow React best practices with hooks
- Implement health data visualization with Recharts
- Maintain HIPAA-inspired privacy and security practices
- Support SDG 3 principles in all features

## Technology Stack
### Frontend
- React.js 18.2.0 with hooks
- React Router Dom for navigation
- Recharts for data visualization
- React Toastify for notifications
- Axios for API communication
- Date-fns for date manipulation

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- BCrypt password hashing
- Express validator for input validation
- CORS for cross-origin requests

## API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/users/*` - User management
- `/api/health/*` - Health record CRUD operations
- `/api/health/analytics` - Health trend analysis