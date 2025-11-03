import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css'; 

const DashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <div className="dashboard-content">
          <div className="neumorph-card" style={{ gridRow: 'span 2' }}>
            <h2>Статистика активності</h2>
            <p>(Заглушка графіку чи може якоїсь діаграми)</p>
                      </div>
          <Link to="/add-help" className="neumorph-card add-help-card">
            <span className="plus-icon">+</span>
            <span>Додати інформацію<br/>про допомогу</span>
          </Link>

          <Link to="/rewards" className="neumorph-card">
            <h2>🏆 Мої нагороди</h2>
            <p> всякі нагороди медалі і тд</p>
          </Link>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;