import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css'; 
import '../styles/MyContributions.css'; 
import '../styles/TasksPage.css'; 

const MyContributionsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        
        const [contribRes, tasksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/contributions/my', config),
          axios.get('http://localhost:5000/api/tasks/my', config)
        ]);
        
        setContributions(contribRes.data);
        setTasks(tasksRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
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
            
            <h2>Завдання в опрацюванні</h2>
            {loading && <p>Завантаження...</p>}
            {!loading && tasks.length === 0 && <p>У вас немає активних завдань.</p>}
            {!loading && tasks.map(task => (
              <div key={`task-${task._id}`} className="task-card"> 
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className="task-points">+{task.points} балів</span>
                </div>
                <p className="task-body">{task.description}</p>
                <Link 
                  to={`/tasks/${task._id}`} 
                  className="task-button" 
                  style={{ textDecoration: 'none', marginTop: '20px' }}
                >
                  Переглянути Деталі
                </Link>
              </div>
            ))}
            
            <h2 style={{ marginTop: '40px' }}>Історія Моїх Заявок</h2>
            {loading && <p>Завантаження...</p>}
            {!loading && contributions.length === 0 && <p>Ви ще не додали жодної заявки.</p>}
            {!loading && contributions.map(item => (
              <div key={`contrib-${item._id}`} className="contribution-card">
                <div className="card-header">
                  <h3>{item.title}</h3>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="card-body">
                  <p>{item.description || item.itemList}</p>
                  {item.status === 'approved' && (
                    <p style={{ color: '#28a745', fontWeight: 600 }}>
                      + {item.pointsAwarded} балів нараховано
                    </p>
                  )}
                  {item.status === 'rejected' && item.rejectionComment && (
                    <div className="rejection-comment">
                      <strong>Причина відхилення:</strong>
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