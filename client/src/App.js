import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import DetectDiseasePage from './pages/DetectDiseasePage';
import DashboardContent from './pages/DashboardContent';
import HistoryPage from './pages/HistoryPage';
import StatisticsPage from './pages/StatisticsPage';
import NearbyStoresPage from './pages/NearbyStoresPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import ContactUsPage from './pages/ContactUsPage';
import MedicineSuggestionPage from './pages/MedicineSuggestionPage'; // <-- Import the new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - These are accessible to everyone */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes - These are wrapped by the DashboardPage component. */}
        <Route path="/dashboard" element={<DashboardPage><DashboardContent /></DashboardPage>} />
        <Route path="/detect" element={<DashboardPage><DetectDiseasePage /></DashboardPage>} />
        <Route path="/history" element={<DashboardPage><HistoryPage /></DashboardPage>} />
        <Route path="/stats" element={<DashboardPage><StatisticsPage /></DashboardPage>} />
        <Route path="/stores" element={<DashboardPage><NearbyStoresPage /></DashboardPage>} />
        <Route path="/settings" element={<DashboardPage><SettingsPage /></DashboardPage>} />
        <Route path="/about" element={<DashboardPage><AboutPage /></DashboardPage>} />
        <Route path="/contact" element={<DashboardPage><ContactUsPage /></DashboardPage>} />
        <Route path="/help" element={<DashboardPage><HelpPage /></DashboardPage>} />
        
        {/* --- ADDED THIS NEW PROTECTED ROUTE --- */}
        <Route 
          path="/remedy" 
          element={<DashboardPage><MedicineSuggestionPage /></DashboardPage>} 
        />
        
      </Routes>
    </Router>
  );
}

export default App;
