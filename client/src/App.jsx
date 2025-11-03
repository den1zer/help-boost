import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
const AddHelpPage = () => <h1 style={{ padding: '50px' }}>Додавання допомоги</h1>;
const RewardsPage = () => <h1 style={{ padding: '50px' }}>Ваші нагороди</h1>;
const ProfilePage = () => <h1 style={{ padding: '50px' }}>Налаштуваня профілю</h1>;
const SupportPage = () => <h1 style={{ padding: '50px' }}>Технічна підтримка</h1>;


function App() {
  const location = useLocation();

  return (
    <div className="App">
      <AnimatePresence mode="wait">         
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
          <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage centerPage={true}><LoginPage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage centerPage={true}><RegisterPage /></AnimatedPage>} />
          <Route path="/add-help" element={<AnimatedPage><AddHelpPage /></AnimatedPage>} />
          <Route path="/rewards" element={<AnimatedPage><RewardsPage /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
          <Route path="/support" element={<AnimatedPage><SupportPage /></AnimatedPage>} />
          <Route 
            path="/forgot-password" 
            element={
              <AnimatedPage centerPage={true}>
                <div className="auth-main-container">
                  <div className="auth-left-panel">
                    <h2>Forgot Password</h2>
                    <p>Coming soon...</p>
                    <Link to="/login" className="auth-button">Back to Login</Link>
                  </div>
                  <div className="auth-right-panel">
                    <h2>No Worries!</h2>
                    <p>We'll help you reset your password.</p>
                  </div>
                </div>
              </AnimatedPage>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;