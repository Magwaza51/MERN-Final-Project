# HealthConnect - Smart Healthcare Platform

## 🏥 Overview
HealthConnect is a comprehensive MERN stack healthcare platform supporting UN Sustainable Development Goal 3: Good Health and Well-Being. It provides a complete solution for health tracking, doctor appointments, and telemedicine services.

## ✨ Features
- 🔐 **User Authentication** - Secure login/registration system
- 📊 **Health Dashboard** - Interactive health metrics visualization
- 👨‍⚕️ **Doctor Search** - Location-based doctor finding with maps
- 📅 **Appointment Booking** - Complete appointment management system
- 🔔 **Real-time Notifications** - Socket.io powered notifications
- 💳 **Payment Processing** - Integrated payment simulation
- 📈 **Analytics Dashboard** - Health data analytics and insights
- 📱 **Progressive Web App** - Mobile-optimized PWA support

## 🛠️ Technology Stack

### Frontend
- **React.js 18.2.0** - Modern UI library with hooks
- **React Router Dom** - Client-side routing
- **Recharts** - Data visualization
- **React Leaflet** - Interactive maps
- **Socket.io Client** - Real-time communication
- **Axios** - API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **BCrypt** - Password hashing
- **Nodemailer** - Email notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd final-project
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   **Backend (.env):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/healthconnect
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

   **Frontend (.env):**
   ```env
   REACT_APP_SERVER_URL=http://localhost:5000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   
   **Option 1: Use the startup script (Windows)**
   ```bash
   start-healthconnect.bat
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

## 📂 Project Structure

```
final-project/
├── backend/                 # Express.js server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
├── frontend/               # React.js client
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── build/             # Production build
├── package.json           # Root package configuration
├── start-healthconnect.bat # Startup script
└── README.md              # Project documentation
```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Status:** http://localhost:5000/api/status

## 📱 Health Metrics Supported

- Blood Pressure (systolic/diastolic)
- Blood Sugar (mg/dL)
- Heart Rate (bpm)
- Weight (kg)
- Body Temperature (°C)
- Oxygen Saturation (%)

## 🔧 Development

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests (if implemented)
cd backend && npm test
```

## 🌍 Deployment

The application is ready for deployment on platforms like:
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Heroku, DigitalOcean, AWS
- **Database:** MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🎯 UN SDG 3 Alignment

This project supports **UN Sustainable Development Goal 3: Good Health and Well-Being** by providing accessible healthcare technology solutions.

---

**HealthConnect - Empowering Better Health Through Technology** 🏥✨