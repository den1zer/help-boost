import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css';
import '../styles/AddHelpPage.css';
import '../styles/ProfilePage.css';

const useAlertHook = () => ({ showAlert: (message) => { alert(message); } });

const ProfilePage = () => {
  const { showAlert } = useAlertHook();
  const [formData, setFormData] = useState({ username: '', email: '', backupEmail: '', age: '', city: '', gender: 'unspecified' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/me', config);
        setFormData({
          username: res.data.username || '', email: res.data.email || '',
          backupEmail: res.data.backupEmail || '', age: res.data.age || '',
          city: res.data.city || '', gender: res.data.gender || 'unspecified',
        });
        setCurrentAvatar(res.data.avatar);
      } catch (err) { showAlert('Помилка завантаження профілю'); }
    };
    fetchProfileData();
  }, []);

  const onChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const onFileChange = (e) => { if (e.target.files.length > 0) { setAvatar(e.target.files[0]); setAvatarPreview(URL.createObjectURL(e.target.files[0])); } };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || formData.username.length < 3) return showAlert('Username має бути мін. 3 символи');
    if (formData.age && (formData.age < 13 || formData.age > 100)) return showAlert('Вік має бути від 13 до 100');

    const data = new FormData();
    data.append('username', formData.username);
    if (formData.age) data.append('age', formData.age);
    if (formData.backupEmail) data.append('backupEmail', formData.backupEmail);
    if (formData.city) data.append('city', formData.city);
    if (formData.gender) data.append('gender', formData.gender);
    if (avatar) data.append('avatar', avatar);

    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token } };
      const res = await axios.put('http://localhost:5000/api/users/me', data, config);
      showAlert('Профіль оновлено!');
      if (res.data.avatar) { setCurrentAvatar(res.data.avatar); setAvatarPreview(null); }
      window.location.reload();
    } catch (err) {
      const errorMsg = err.response?.data?.errors ? err.response.data.errors[0].msg : (err.response?.data?.msg || 'Помилка');
      showAlert(errorMsg);
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
                <div className="avatar-preview">{avatarPreview ? <img src={avatarPreview} /> : currentAvatar ? <img src={`http://localhost:5000/${currentAvatar}`} /> : '👤'}</div>
                <label htmlFor="avatar" className="avatar-change-btn">Змінити фото<input type="file" id="avatar" accept="image/*" onChange={onFileChange} /></label>
              </div>
              <div className="form-grid">
                <div className="form-group"><label>Username</label><input type="text" name="username" className="neumorph-input" value={formData.username} onChange={onChange} /></div>
                <div className="form-group"><label>Email</label><input type="email" className="neumorph-input" value={formData.email} disabled /></div>
                <div className="form-group"><label>Резервний Email</label><input type="email" name="backupEmail" className="neumorph-input" value={formData.backupEmail} onChange={onChange} /></div>
                <div className="form-group"><label>Вік</label><input type="number" name="age" className="neumorph-input" value={formData.age} onChange={onChange} /></div>
                <div className="form-group full-width"><label>Місто</label><input type="text" name="city" className="neumorph-input" value={formData.city} onChange={onChange} /></div>
                <div className="form-group full-width"><label>Стать</label><select name="gender" className="neumorph-select" value={formData.gender} onChange={onChange}><option value="unspecified">Не вказано</option><option value="male">Чоловік</option><option value="female">Жінка</option><option value="other">Інше</option></select></div>
              </div>
              <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />
              <button type="submit" className="neumorph-button">Зберегти зміни</button>
            </form>
          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};
export default ProfilePage;