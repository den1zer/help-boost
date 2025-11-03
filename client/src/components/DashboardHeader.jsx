import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';

const DashboardHeader = () => {
  const [userData, setUserData] = useState({ username: 'Завантаження...', points: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      setTimeout(() => {
        const fetchedData = {
          username: "??????",
          points: 1111,
        };
        setUserData(fetchedData);
        setIsLoading(false);
      }, 1000); 
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