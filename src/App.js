// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // Import the SignupPage component
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import our new component
import './App.css';
import BackgroundImage from './assets/background.jpeg';

function App() {
  // 2. Create a style object for the background
  const appStyle = {
    backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.8)), url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    height: '100vh', // Ensure the background covers the full viewport height
  };

  return (
    <Router>
     {/* 
        CHANGE 1: Apply the style object directly to the main container div.
        CHANGE 2: Remove the extra, empty div.
      */}
      <div className="App" style={appStyle}>
        {/* The Routes component is now a CHILD of the div with the background */}
        <Routes>
          {/* The login page is a public route */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> {/* <-- ADD THIS NEW ROUTE */}

          {/* The dashboard page is a protected route */}
          {/* We wrap the DashboardPage component with our ProtectedRoute */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;