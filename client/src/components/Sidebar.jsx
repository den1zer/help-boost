import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiAward, 
  FiPlus, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiHelpCircle 
} from 'react-icons/fi';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

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
        <NavLink to="/profile" className="sidebar-link">
          <span className="sidebar-icon"><FiUser /></span>
          <span className="sidebar-text">Профіль</span>
        </NavLink>
        <NavLink to="/" className="sidebar-link" end>
          <span className="sidebar-icon"><FiGrid /></span>
          <span className="sidebar-text">Дашборд</span>
        </NavLink>
        <NavLink to="/add-help" className="sidebar-link">
          <span className="sidebar-icon"><FiPlus /></span>
          <span className="sidebar-text">Додати допомогу</span>
        </NavLink>
        <NavLink to="/rewards" className="sidebar-link">
          <span className="sidebar-icon"><FiAward /></span>
          <span className="sidebar-text">Нагороди</span>
        </NavLink>
      </div>

      <div style={{ flexGrow: 1 }}></div>
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