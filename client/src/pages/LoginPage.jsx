import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); 

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login({ email, password });
      alert('Вхід успішний!');
      navigate('/pages/DashboardPage.jsx');
    } catch (error) {
      alert('Помилка входу: ' + error.response.data.msg);
    }
  };

  return (
    <div className="auth-main-container">
      <div className="auth-left-panel"> 
        <h2>Sign in to Website</h2>
        <div className="social-icons">
          <img className='social-icon' src="/assets/images/icon-facebook.png" alt="facebook_logo" />
          <img className='social-icon' src="/assets/images/icon-instagram.png" alt="instagram_logo" /> 
          <img className='social-icon' src="/assets/images/icon-telegram.png" alt="telegram_logo" /> 
        </div>
        <p className="divider">or use your email account</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
            />
          </div>
          <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
          <button type="submit" className="auth-button">SIGN IN</button>
        </form>
      </div>

      <div className="auth-right-panel"> 
        <div className="circle-decoration top-right"></div>
        <div className="circle-decoration bottom-left"></div>
        <h2>Hello Friend !</h2>
        <p>Enter your personal details and start journey with us</p>
        <Link to="/register" className="auth-button">SIGN UP</Link>
      </div>
    </div>
  );
};

export default LoginPage;