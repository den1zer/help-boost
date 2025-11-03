// client/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Додайте Link для тестування
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// Імпортуємо нову сторінку
import AdminDashboardPage from './pages/AdminDashboardPage'; 

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Сторінки для Юзера */}
        <Route path="/" element={<DashboardPage />} />
        
        {/* Сторінка для Адміна */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* Сторінки автентифікації */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/forgot-password" 
          element={
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
          } 
        />
      </Routes>
    </div>
  );
}

export default App;