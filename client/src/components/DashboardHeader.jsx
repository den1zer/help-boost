import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const POINT_LEVELS = [
  { level: 1, name: 'Новачок', value: 500 },
  { level: 2, name: 'Спеціаліст', value: 1000 },
  { level: 3, name: 'Профі', value: 3000 },
  { level: 4, name: 'Експерт', value: 5000 },
  { level: 5, name: 'Майстер', value: 10000 },
  { level: 6, name: 'Грандмайстер', value: 15000 },
  { level: 7, name: 'Легенда', value: 20000 },
  { level: 8, name: 'Semigod', value: 30000 },
];

const DashboardHeader = () => {
  const [userData, setUserData] = useState({ username: 'Завантаження...', points: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentLevel, setCurrentLevel] = useState({ name: '---', icon: '🔒' });
  const [nextLevel, setNextLevel] = useState({ value: 500 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        if (!token) {
          setIsLoading(false);
          setUserData({ username: 'Гість', points: 0 }); 
          return;
        }

        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/me', config);

        setUserData({
          username: res.data.username,
          points: res.data.points 
        });
        
        const userPoints = res.data.points;
        let achievedLevel = null;
        let nextLevelTarget = POINT_LEVELS[0]; 

        for (const level of POINT_LEVELS) {
          if (userPoints >= level.value) {
            achievedLevel = level;
          } else {
            nextLevelTarget = level; 
            break;
          }
        }
        
        if (achievedLevel && !POINT_LEVELS.find(l => l.level === achievedLevel.level + 1)) {
          nextLevelTarget = null;
        }

        if (achievedLevel) {
          setCurrentLevel({ name: achievedLevel.name, icon: achievedLevel.icon || '🏆' });
        } else {
          setCurrentLevel({ name: 'Рекрут', icon: '👤' });
        }

        if (nextLevelTarget) {
          setNextLevel(nextLevelTarget);
          const startValue = achievedLevel ? achievedLevel.value : 0;
          const endValue = nextLevelTarget.value;
          const progressValue = userPoints - startValue;
          const totalValue = endValue - startValue;
          setProgress(Math.min((progressValue / totalValue) * 100, 100));
        } else {
          setProgress(100);
          setNextLevel(null);
        }

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setUserData({ username: 'Помилка', points: 0 }); 
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []); 

  return (
    <header className="dashboard-header">
      <h1>Вітаємо, {userData.username}!</h1>
      
      <div className="header-points">
        <span className="icon">⭐</span>
        <span>{isLoading ? '---' : `${userData.points} балів`}</span>

        <div className="points-tooltip">
          <h4>{currentLevel.icon} {currentLevel.name}</h4>
          
          {nextLevel ? (
            <>
              <p>Прогрес до наступного рівня:</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.8em', marginTop: '5px' }}>
                {userData.points} / {nextLevel.value}
              </p>
            </>
          ) : (
            <p>Ви досягли максимального рівня!</p>
          )}

          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #ccc' }} />
          <p>
            <Link to="/rewards" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 600 }}>
              → Переглянути всі нагороди
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;