import React, { useState } from 'react';
import authService from '../api/authService';
import { Link, useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register({ username, email, password });
      alert('Реєстрація успішна!');
      navigate('/login');
    } catch (error) {
      alert('Помилка реєстрації: ' + (error.response?.data?.msg || 'Невідома помилка'));
    }
  };

  return (
    <div className="auth-main-container">
       <div className="auth-right-panel"> 
        <div className="circle-decoration top-right"></div>
        <div className="circle-decoration bottom-left"></div>
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
        <Link to="/login" className="auth-button">SIGN IN</Link>
      </div>

      <div className="auth-left-panel"> 
        <h2>Create Account</h2> 
        <div className="social-icons">
          <img className='social-icon' src="/assets/images/icon-facebook.png" alt="facebook_logo" />
          <img className='social-icon' src="/assets/images/icon-instagram.png" alt="instagram_logo" /> 
          <img className='social-icon' src="/assets/images/icon-telegram.png" alt="telegram_logo" /> 
        </div>
        <p className="divider">or use your email for registration</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Username"
              required
            />
          </div>
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
              minLength="6"
            />
          </div>
          <button type="submit" className="auth-button">SIGN UP</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;