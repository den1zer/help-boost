import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  
  return (
    <div>
      <h2>Дашборд</h2>
      <p>Вітаємо! Ви увійшли в систему "Help&Boost".</p>
      
      <nav>
        <Link to="/login">На сторінку входу</Link> | 
        <Link to="/register"> На сторінку реєстрації</Link>
      </nav>
    </div>
  );
};

export default DashboardPage;