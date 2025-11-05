import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css'; 
import '../styles/MyContributions.css'; 

const MyContributionsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMyContributions = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/contributions/my', config);
        setContributions(res.data);
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchMyContributions();
  }, []);
  const getStatusClass = (status) => {
    if (status === 'pending') return 'status-pending';
    if (status === 'approved') return 'status-approved';
    if (status === 'rejected') return 'status-rejected';
    return '';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <AnimatedPage>
          <div className="contributions-container">
            <h2>Мої Заявки</h2>
            {loading && <p>Завантаження...</p>}
            {!loading && contributions.length === 0 && <p>Ви ще не додали жодної заявки.</p>}
            {!loading && contributions.map(item => (
              <div key={item._id} className="contribution-card">
                <div className="card-header">
                  <h3>{item.title}</h3>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="card-body">
                  <p>{item.description}</p>
                  {item.status === 'approved' && (
                    <p style={{ color: '#28a745', fontWeight: 600 }}>
                      + {item.pointsAwarded} балів нараховано
                    </p>
                  )}
                  {item.status === 'rejected' && item.rejectionComment && (
                    <div className="rejection-comment">
                      <strong>Причина відхилення (від Адміністратора):</strong>
                      <p>{item.rejectionComment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};
export default MyContributionsPage;