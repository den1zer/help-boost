import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import MapPicker from '../components/MapPicker'; 
import '../styles/Dashboard.css'; 
import '../styles/AddHelpPage.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const AddHelpPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'donation', 
  });
  
  const [file, setFile] = useState(null); 
  const [location, setLocation] = useState(null); 
  const [message, setMessage] = useState('');
  
  const [isMapOpen, setIsMapOpen] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFile(e.target.files.length > 0 ? e.target.files[0] : null);
  };

  const handleLocationSelect = (coords) => {
    setLocation(coords); 
    setIsMapOpen(false); 
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Будь ласка, завантажте файл підтвердження.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('location', JSON.stringify(location)); 
    data.append('proofFile', file);
    
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      };
      const res = await axios.post('http://localhost:5000/api/contributions/add', data, config);
      alert('Успіх! ' + res.data.msg);
      
      setFormData({ title: '', description: '', type: 'donation' });
      setFile(null);
      setLocation(null);
      setMessage('');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Сталася помилка.';
      alert('Помилка! ' + errorMsg);
    }
  };

  return (
    <> 
      {isMapOpen && (
        <MapPicker 
          closeModal={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}

      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <DashboardHeader />
          
          <div className="add-help-container">
            <form className="add-help-form" onSubmit={onSubmit}>
              <h2>Додати інформацію про допомогу</h2>

              <div className="form-group">
                <label htmlFor="title">Заголовок</label>
                <input type="text" id="title" name="title" className="neumorph-input" value={formData.title} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="type">Тип допомоги</label>
                <select id="type" name="type" className="neumorph-select" value={formData.type} onChange={onChange}>
                  <option value="donation">Фінансовий донат</option>
                  <option value="volunteering">Волонтерське завдання</option>
                  <option value="aid">Гуманітарна допомога (речі)</option>
                  <option value="other">Інше</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Опис</label>
                <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange} placeholder="Опишіть детальніше..."></textarea>
              </div>
              <div className="form-group">
                <label>Підтвердження (фото, скріншот донату)</label>
                <label htmlFor="proofFile" className={`neumorph-file-input ${file ? 'file-selected' : ''}`}>
                  <span>📁 </span>
                  {file ? file.name : 'Натисніть, щоб обрати фото/файли'}
                  <input type="file" id="proofFile" onChange={onFileChange} />
                </label>
              </div>

              <div className="form-group">
                <label>Місце передачі (опціонально)</label>
                <div 
                  className={`map-placeholder ${location ? 'map-active' : ''}`} 
                  onClick={() => setIsMapOpen(true)}
                >
                  {location ? (
                    <>
                      <div className="map-preview">
                        <MapContainer 
                          center={[location.lat, location.lng]} 
                          zoom={13} 
                          scrollWheelZoom={false} 
                          dragging={false} 
                          zoomControl={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[location.lat, location.lng]}></Marker>
                        </MapContainer>
                      </div>
                      <div className="map-preview-text">
                        <span className="selected-text">✅ Точку обрано!</span>
                        <span className="selected-coords">({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</span>
                      </div>
                    </>
                  ) : (
                    <span>Натисніть, щоб обрати<br/>точку на карті</span>
                  )}
                </div>
              </div>
              
              <hr style={{ margin: '30px 0', border: '1px solid #ccc' }} />
              <button type="submit" className="neumorph-button">
                Відправити на верифікацію
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddHelpPage;