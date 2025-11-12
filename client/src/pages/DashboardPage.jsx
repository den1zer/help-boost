import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import StatsChart from '../components/StatsChart'; 
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const [contributions, setContributions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        
        const [contribRes, leaderboardRes] = await Promise.all([
          axios.get('http://localhost:5000/api/contributions/my', config),
          axios.get('http://localhost:5000/api/users/leaderboard', config)
        ]);
        
        setContributions(contribRes.data);
        setLeaderboard(leaderboardRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalApproved = contributions.filter(c => c.status === 'approved').length;
    const totalPending = contributions.filter(c => c.status === 'pending').length;
    return { totalApproved, totalPending };
  }, [contributions]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <AnimatedPage>
          <div className="dashboard-content-wrapper">
            {loading ? (
              <div className="stat-card">Завантаження статистики...</div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-title">Схвалено Заявок</p>
                    <p className="stat-value">{stats.totalApproved}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-title">Чекає на Перевірку</p>
                    <p className="stat-value">{stats.totalPending}</p>
                  </div>
                </div>

                <div className="dashboard-content">
                  
                  <div className="chart-container" style={{ gridRow: 'span 2' }}>
                    <h2>Активність (Останні 7 днів)</h2>
                    <StatsChart contributions={contributions} />
                  </div>

                  <Link to="/add-help" className="neumorph-card add-help-card">
                    <span className="plus-icon">+</span>
                    <span>Додати допомогу</span>
                  </Link>

                  <div className="neumorph-card leaderboard-card">
                    <h2>🏆 Рейтинг (Топ-10)</h2>
                    <ul className="leaderboard-list">
                      {leaderboard.map((user, index) => (
                        <li key={user._id} className="leaderboard-item">
                          <span className="leaderboard-rank">#{index + 1}</span>
                          <img
                            src={user.avatar ? `http://localhost:5000/${user.avatar}` : 'default-avatar-path.png'}
                            onError={(e) => e.target.src = 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg'}
                            alt="avatar"
                            className="leaderboard-avatar"
                          />
                          <span className="leaderboard-user">{user.username}{user.selectedBadge && user.selectedBadge.icon ? ` ${user.selectedBadge.icon} ${user.selectedBadge.name}` : ''}</span>
                          <span className="leaderboard-points">{user.points}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                </div>
              </>
            )}
          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};

export default DashboardPage;