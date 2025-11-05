import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import { useNavigate } from 'react-router-dom'; 

import '../styles/AdminDashboard.css'; 
import '../styles/AddHelpPage.css'; 

const PendingContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchPending = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/contributions/pending', config);
      setContributions(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Не вдалося завантажити дані');
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchPending(); }, []);
  
  const handleApprove = async (id) => {
    const pointsInput = prompt("Скільки балів нарахувати?", "100");
    if (pointsInput === null) return; 
    const points = parseInt(pointsInput) || 100; 
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`http://localhost:5000/api/contributions/approve/${id}`, { points: points }, config);
      setContributions(contributions.filter(c => c._id !== id));
    } catch (err) { alert('Помилка схвалення: ' + (err.response?.data?.msg || '')); }
  };
  
  const handleReject = async (id) => {
    const comment = prompt('Вкажіть причину відхилення:');
    if (comment === null) return;
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = { headers: { 'x-auth-token': token } };
      await axios.put(`http://localhost:5000/api/contributions/reject/${id}`, { comment: comment }, config);
      setContributions(contributions.filter(c => c._id !== id));
    } catch (err) { alert('Помилка відхилення: ' + (err.response?.data?.msg || '')); }
  };
  
  if (loading) return <p>Завантаження заявок...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (contributions.length === 0) return <p>Нових заявок немає.</p>;
  
  return (
    <table className="admin-table">
      <thead><tr><th>Користувач</th><th>Тип</th><th>Заголовок</th><th>Підтвердження</th><th>Дії</th></tr></thead>
      <tbody>
        {contributions.map(item => (
          <tr key={item._id}>
            <td>{item.user ? `${item.user.username} (${item.user.email})` : 'Користувач видалений'}</td>
            <td>{item.type}</td>
            <td>{item.title}</td>
            <td><a href={`http://localhost:5000/${item.filePath}`} target="_blank" rel="noopener noreferrer" className="proof-link">Подивитись</a></td>
            <td>
              <button className="action-btn approve" onClick={() => handleApprove(item._id)}>Схвалити</button>
              <button className="action-btn reject" onClick={() => handleReject(item._id)}>Відхилити</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = JSON.parse(localStorage.getItem('userToken'));
    const config = { headers: { 'x-auth-token': token } };
    try {
      const res = await axios.get('http://localhost:5000/api/users', config);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Впевнені, що хочете змінити роль цьому юзеру на ${newRole}?`)) {
      return;
    }
    const token = JSON.parse(localStorage.getItem('userToken'));
    const config = { headers: { 'x-auth-token': token } };
    try {
      await axios.put(`http://localhost:5000/api/users/role/${id}`, { role: newRole }, config);
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
      alert('Роль оновлено!');
    } catch (err) {
      alert('Помилка оновлення ролі');
    }
  };

  if (loading) return <p>Завантаження користувачів...</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <select 
                value={user.role} 
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                className="neumorph-select" 
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              {user.role === 'user' ? (
                <button 
                  className="action-btn approve" 
                  onClick={() => handleRoleChange(user._id, 'admin')}
                >
                  Зробити Адміністратором
                </button>
              ) : (
                <button 
                  className="action-btn reject" 
                  onClick={() => handleRoleChange(user._id, 'user')}
                >
                  Зробити Користувачем
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/support/tickets', config);
        setTickets(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <p>Завантаження тікетів...</p>;
  if (tickets.length === 0) return <p>Нових тікетів немає.</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>Ім'я</th><th>Email</th><th>Телефон</th><th>Питання</th></tr></thead>
      <tbody>
        {tickets.map(ticket => (
          <tr key={ticket._id}>
            <td>{ticket.name}</td>
            <td><a href={`mailto:${ticket.email}`} className="proof-link">{ticket.email}</a></td>
            <td>{ticket.phone || '---'}</td>
            <td>{ticket.question}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminFeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const StarRating = ({ rating }) => (
    <div className="admin-rating-stars">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/support/feedback', config);
        setFeedback(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) return <p>Завантаження відгуків...</p>;
  if (feedback.length === 0) return <p>Нових відгуків немає.</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>Користувач</th><th>Рейтинг (1-5)</th><th>Коментар</th></tr></thead>
      <tbody>
        {feedback.map(item => (
          <tr key={item._id}>
            <td>{item.user ? item.user.username : 'Анонім'}</td>
            <td><StarRating rating={item.rating} /></td>
            <td>{item.comment || '---'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CreateFundraiser = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', goalAmount: '', cardName: '', cardNumber: ''
  });
  const [message, setMessage] = useState('');
  
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = { headers: { 'x-auth-token': token } };
      await axios.post('http://localhost:5000/api/fundraisers', formData, config);
      setMessage('Збір успішно створено!');
      setFormData({ title: '', description: '', goalAmount: '', cardName: '', cardNumber: '' });
    } catch (err) {
      setMessage('Помилка: ' + (err.response?.data?.msg || 'Щось пішло не так'));
    }
  };

  return (
    <form className="add-help-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Назва Збору (напр. "На дрони")</label>
        <input type="text" name="title" value={formData.title} onChange={onChange} className="neumorph-input" required />
      </div>
      <div className="form-group">
        <label>Ціль (UAH)</label>
        <input type="number" name="goalAmount" value={formData.goalAmount} onChange={onChange} className="neumorph-input" required />
      </div>
      <div className="form-group">
        <label>Опис</label>
        <textarea name="description" value={formData.description} onChange={onChange} className="neumorph-textarea" required></textarea>
      </div>
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }}/>
      <div className="form-group">
        <label>Реквізити (Ім'я на карті)</label>
        <input type="text" name="cardName" value={formData.cardName} onChange={onChange} className="neumorph-input" required />
      </div>
      <div className="form-group">
        <label>Реквізити (Номер картки)</label>
        <input type="text" name="cardNumber" value={formData.cardNumber} onChange={onChange} className="neumorph-input" required />
      </div>
      <button type="submit" className="neumorph-button">Створити Збір</button>
      {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
    </form>
  );
};
        
// --- ОНОВЛЕНИЙ ГОЛОВНИЙ КОМПОНЕНТ ---
const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('contributions');
  const navigate = useNavigate(); 
  
  const handleLogout = () => {
    alert('Ви вийшли з адмін-панелі');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/login'); 
  };

  return (
    <AnimatedPage>
      <div className="admin-container">
        <div className="admin-header">
          <h2>Адмін-панель</h2>
          <button 
            className="action-btn reject" 
            onClick={handleLogout}
          >
            Вийти
          </button>
        </div>
        
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            Заявки
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Користувачі
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            Тікети
          </button>
          <button 
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            Відгуки
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fundraisers' ? 'active' : ''}`}
            onClick={() => setActiveTab('fundraisers')}
          >
            Створити Збір
          </button>
        </div>
        
        {activeTab === 'contributions' && <PendingContributions />}
        {activeTab === 'users' && <AdminUserList />}
        {activeTab === 'tickets' && <AdminTicketList />}
        {activeTab === 'feedback' && <AdminFeedbackList />}
        {activeTab === 'fundraisers' && <CreateFundraiser />}

      </div>
    </AnimatedPage>
  );
};

export default AdminDashboardPage;