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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const itemsPerPage = 6;

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

  useEffect(() => {
    document.body.classList.add('no-vertical-scroll');
    return () => {
      document.body.classList.remove('no-vertical-scroll');
    };
  }, []);

  const getStatusClass = (status) => {
    if (status === 'pending') return 'status-pending';
    if (status === 'approved') return 'status-approved';
    if (status === 'rejected') return 'status-rejected';
    return '';
  };

  const getTypeLabel = (type) => {
    if (!type) return 'Невідомо';
    if (type === 'donation') return 'Фінансовий донат';
    if (type === 'volunteering') return 'Волонтерство';
    if (type === 'aid') return 'Допомога';
    return 'Інше';
  };

  const getTypeIcon = (type) => {
    if (type === 'donation') return '💸';
    if (type === 'volunteering') return '🤝';
    if (type === 'aid') return '📦';
    return '🔖';
  };

  const [selectedType, setSelectedType] = useState('all');

  const filteredContributions = contributions.filter(c => selectedType === 'all' ? true : (c.type === selectedType));

  const indexOfLastContrib = currentPage * itemsPerPage;
  const indexOfFirstContrib = indexOfLastContrib - itemsPerPage;
  const currentContributions = filteredContributions.slice(indexOfFirstContrib, indexOfLastContrib);
  const totalContribPages = Math.ceil(filteredContributions.length / itemsPerPage);
  const indexOfLastTask = currentTaskPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalTaskPages = Math.ceil(tasks.length / itemsPerPage);

  const handleContribPageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 120);
  };

  const handleTaskPageChange = (pageNum) => {
    setCurrentTaskPage(pageNum);
    window.scrollTo(0, 120);
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
            {!loading && tasks.length > 0 && (
              <>
                <div className="tasks-grid">
                  {currentTasks.map(task => (
                    <div key={`task-${task._id}`} className="task-card"> 
                      <div className="task-header">
                        <h3>{task.title}</h3>
                        <span className="task-points">+{task.points} балів</span>
                      </div>
                      <p className="task-body">{task.description}</p>
                      <Link 
                        to={`/tasks/${task._id}`} 
                        className="task-button" 
                        style={{ textDecoration: 'none' }}
                      >
                        Переглянути Деталі
                      </Link>
                    </div>
                  ))}
                </div>
                {totalTaskPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalTaskPages }, (_, i) => i + 1).map(pageNum => (
                      <button 
                        key={pageNum}
                        className={`pagination-btn ${currentTaskPage === pageNum ? 'active' : ''}`}
                        onClick={() => handleTaskPageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            
            <h2 style={{ marginTop: '40px' }}>Історія Моїх Заявок</h2>
            <div className="filter-bar">
              <button className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`} onClick={() => { setSelectedType('all'); setCurrentPage(1); }}>
                Усі
              </button>
              <button className={`filter-btn ${selectedType === 'donation' ? 'active' : ''}`} onClick={() => { setSelectedType('donation'); setCurrentPage(1); }}>
                💸 Донат
              </button>
              <button className={`filter-btn ${selectedType === 'volunteering' ? 'active' : ''}`} onClick={() => { setSelectedType('volunteering'); setCurrentPage(1); }}>
                🤝 Волонтерство
              </button>
              <button className={`filter-btn ${selectedType === 'aid' ? 'active' : ''}`} onClick={() => { setSelectedType('aid'); setCurrentPage(1); }}>
                📦 Допомога
              </button>
              <button className={`filter-btn ${selectedType === 'other' ? 'active' : ''}`} onClick={() => { setSelectedType('other'); setCurrentPage(1); }}>
                Інше
              </button>
            </div>
            {loading && <p>Завантаження...</p>}
            {!loading && contributions.length === 0 && <p>Ви ще не додали жодної заявки.</p>}
            {!loading && contributions.length > 0 && (
              <>
                <div className="contributions-grid">
                  {currentContributions.map(item => (
                    <div key={`contrib-${item._id}`} className="contribution-card">
                      <div className="card-header">
                        <h3>{item.title}</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`type-badge type-${item.type || 'other'}`}><span className="type-icon">{getTypeIcon(item.type)}</span> {getTypeLabel(item.type)}</span>
                          <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>
                        </div>
                      </div>
                      <div style={{fontSize: '0.8em', color: '#999', marginBottom: '10px'}}>
                        📅 Створено: {new Date(item.createdAt).toLocaleDateString('uk-UA')} 
                        {item.status === 'approved' && ` | ✅ Схвалено: ${new Date(item.updatedAt).toLocaleDateString('uk-UA')}`}
                        {item.status === 'rejected' && ` | ❌ Відхилено: ${new Date(item.updatedAt).toLocaleDateString('uk-UA')}`}
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
                {totalContribPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalContribPages }, (_, i) => i + 1).map(pageNum => (
                      <button 
                        key={pageNum}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handleContribPageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};
export default MyContributionsPage;