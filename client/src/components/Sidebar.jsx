import React, { useState , useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArchive } from 'react-icons/fi'; 
import { 
  FiGrid, 
  FiAward, 
  FiPlus, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiHelpCircle,
  FiBookOpen,
  FiDollarSign,
  FiClipboard
  
} from 'react-icons/fi';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null); 

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        if (!token) return; 
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/me', config);

        if (res.data.avatar) {
          setAvatar(res.data.avatar);
        }
      } catch (err) {
        console.error('Не вдалося завантажити аватар для сайдбару', err);
      }
    };
    fetchUserAvatar();
  }, []); 
 

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLogout = () => {
    alert('Ви вийшли з системи');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      
      <div className="sidebar-nav">
        <NavLink to="/profile" className="sidebar-link sidebar-profile">
          <span className="sidebar-icon">
            {avatar ? (
              <img 
                src={`http://localhost:5000/${avatar}`} 
                alt="Avatar" 
                className="sidebar-avatar-img" 
              />
            ) : (
              <FiUser /> 
            )}
          </span>
          <span className="sidebar-text">Профіль</span>
        </NavLink>
        <NavLink to="/" className="sidebar-link" end>
          <span className="sidebar-icon"><FiGrid /></span>
          <span className="sidebar-text">Дашборд</span>
        </NavLink>
        <NavLink to="/my-contributions" className="sidebar-link">
          <span className="sidebar-icon"><FiX/></span>
          <span className="sidebar-text">Мої Заявки</span>
        </NavLink>
        <NavLink to="/add-help" className="sidebar-link">
          <span className="sidebar-icon"><FiPlus /></span>
          <span className="sidebar-text">Додати допомогу</span>
        </NavLink>
        <NavLink to="/rewards" className="sidebar-link">
          <span className="sidebar-icon"><FiAward /></span>
          <span className="sidebar-text">Нагороди</span>
        </NavLink>
        <NavLink to="/fundraisers" className="sidebar-link">
          <span className="sidebar-icon"><FiDollarSign /></span>
          <span className="sidebar-text">Збори</span>
        </NavLink>        
        <NavLink to="/tasks" className="sidebar-link">
          <span className="sidebar-icon"><FiClipboard /></span>
          <span className="sidebar-text">Завдання</span>
        </NavLink>
        
      </div>
      

      <div style={{ flexGrow: 1 }}></div>
      <NavLink to="/instructions" className="sidebar-link">
        <span className="sidebar-icon"><FiBookOpen /></span>
        <span className="sidebar-text">Інструкція</span>
      </NavLink>
      <NavLink to="/support" className="sidebar-link">
        <span className="sidebar-icon"><FiHelpCircle /></span>
        <span className="sidebar-text">Тех. підтримка</span>
      </NavLink>

      <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none' }}>
        <span className="sidebar-icon"><FiLogOut /></span>
        <span className="sidebar-text">Вийти</span>
      </button>
    </nav>
  );
};

export default Sidebar;