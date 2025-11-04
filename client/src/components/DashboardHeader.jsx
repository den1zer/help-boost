import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Navigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

const DashboardHeader = () => {
  const [userData, setUserData] = useState({ username: 'Завантаження...', points: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));

        if (!token) {
          setIsLoading(false);
          setUserData({ username: 'Гість', points: 0 }); 
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        const res = await axios.get('http://localhost:5000/api/users/me', config);

        setUserData({
          username: res.data.username,
          points: res.data.points 
        });
        setIsLoading(false);

      } catch (err) {
        console.error(err);
        setUserData({ username: 'Помилка', points: 0 }); 
        setIsLoading(false);
        Navigate('/login');
      }
    };

    fetchUserData();
  }, []); 

  return (
    <header className="dashboard-header">
      
      <h1>Вітаємо, {userData.username}!</h1>
      
      <div className={`header-points ${isLoading ? '' : 'loading'}`}>
        <span className="icon"><FiStar /></span>
        <span>{isLoading ? '---' : `${userData.points} балів`}</span>
      </div>
    </header>
  );
};

export default DashboardHeader;