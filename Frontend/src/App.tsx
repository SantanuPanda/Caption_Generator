import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/Landingpage/Landingpage';
import Gencaption from './components/CaptionGenerator/Gencaption';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div style={{ minHeight: '100vh', transition: 'all 0.3s ease' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/LoginPage" element={<LandingPage />} />
              <Route path="/RegisterPage" element={<LandingPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/generatecaption" 
                element={
                  <ProtectedRoute>
                    <Gencaption />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};
export default App;
