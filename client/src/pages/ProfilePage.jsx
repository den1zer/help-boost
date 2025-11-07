import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css'; 
import '../styles/AddHelpPage.css'; 
import '../styles/ProfilePage.css'; 

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', backupEmail: '',
    age: '', city: '', gender: 'unspecified',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/me', config);
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          backupEmail: res.data.backupEmail || '',
          age: res.data.age || '',
          city: res.data.city || '',
          gender: res.data.gender || 'unspecified',
        });
        setCurrentAvatar(res.data.avatar);
      } catch (err) { console.error(err); }
    };
    fetchUserData();
  }, []);
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('age', formData.age);
    data.append('backupEmail', formData.backupEmail);
    data.append('city', formData.city);
    data.append('gender', formData.gender);
    if (avatar) {
      data.append('avatar', avatar);
    }
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      };
      const res = await axios.put('http://localhost:5000/api/users/me', data, config);
      alert('Профіль оновлено!');
      if (res.data.avatar) {
        setCurrentAvatar(res.data.avatar);
        setAvatarPreview(null);
      }
    } catch (err) {
      alert('Помилка оновлення: ' + (err.response?.data?.msg || ''));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <AnimatedPage>
          <div className="profile-container">
            <form className="profile-form" onSubmit={onSubmit}>
              <h2>Налаштування Профілю</h2>
              <div className="avatar-section">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" />
                  ) : currentAvatar ? (
                    <img src={`http://localhost:5000/${currentAvatar}`} alt="Avatar" />
                  ) : ( '👤' )}
                </div>
                <label htmlFor="avatar" className="avatar-change-btn">
                  Змінити фото
                  <input type="file" id="avatar" accept="image/*" onChange={onFileChange} />
                </label>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" className="neumorph-input" value={formData.username} onChange={onChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" className="neumorph-input" value={formData.email} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="backupEmail">Резервний Email</label>
                  <input type="email" id="backupEmail" name="backupEmail" className="neumorph-input" value={formData.backupEmail} onChange={onChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Вік</label>
                  <input type="number" id="age" name="age" className="neumorph-input" value={formData.age} onChange={onChange} />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="city">Місто проживання</label>
                  <input type="text" id="city" name="city" className="neumorph-input" value={formData.city} onChange={onChange} />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="gender">Стать</label>
                  <select id="gender" name="gender" className="neumorph-select" value={formData.gender} onChange={onChange}>
                    <option value="unspecified">Не вказано</option>
                    <option value="male">Чоловік</option>
                    <option value="female">Жінка</option>
                  </select>
                </div>
              </div>
              <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />
              <button type="submit" className="neumorph-button">
                Зберегти зміни
              </button>
            </form>
          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};
export default ProfilePage;