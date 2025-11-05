import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AddHelpPage from './pages/AddHelpPage'; 
import MyContributionsPage from './pages/MyContributionsPage';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import SupportPage from './pages/SupportPage'; 
import InstructionsPage from './pages/InstructionsPage';
import FundraisersPage from './pages/FundraisersPage';


const ForgotPasswordPage = () => (
  <div className="auth-page"> 
    <h1 style={{ padding: '50px' }}>Сторінка відновлення паролю</h1>
    <Link to="/login">Повернутись до логіну</Link>
  </div>
);

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        <Route path="/" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
        <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage centerPage={true}><LoginPage /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage centerPage={true}><RegisterPage /></AnimatedPage>} />
        <Route path="/add-help" element={<AnimatedPage><AddHelpPage /></AnimatedPage>} /> 
        <Route path="/rewards" element={<AnimatedPage><RewardsPage /></AnimatedPage>} />
        <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage centerPage={true}><ForgotPasswordPage /></AnimatedPage>} />
        <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
        <Route path="/my-contributions" element={<AnimatedPage><MyContributionsPage /></AnimatedPage>} />
        <Route path="/rewards" element={<AnimatedPage><RewardsPage /></AnimatedPage>} />
        <Route path="/support" element={<AnimatedPage><SupportPage /></AnimatedPage>} />
        <Route path="/instructions" element={<AnimatedPage><InstructionsPage /></AnimatedPage>} />
        <Route path="/fundraisers" element={<AnimatedPage><FundraisersPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;