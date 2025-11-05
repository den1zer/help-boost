import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import MapPicker from '../components/MapPicker';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; 
import AnimatedPage from '../components/AnimatedPage'; 
import '../styles/Dashboard.css'; 
import '../styles/AddHelpPage.css';
import axios from 'axios';

const AddHelpPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'donation', 
    amount: '',       
    itemList: '',     
    comment: '',      
  });
  
  const [file, setFile] = useState(null); 
  const [location, setLocation] = useState(null); 
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
      alert('Будь ласка, завантажте файл підтвердження (PDF або Фото).');
      return;
    }
    if (formData.type === 'aid' && !formData.itemList) {
      alert('Для гуманітарної допомоги "Перелік" є обов\'язковим.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('amount', formData.amount);
    data.append('itemList', formData.itemList);
    data.append('comment', formData.comment);
    data.append('location', JSON.stringify(location)); 
    data.append('proofFile', file);
    
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      };
      const res = await axios.post('http://localhost:5000/api/contributions/add', data, config);
      alert('Успіх! ' + res.data.msg);
      setFormData({ 
        title: '', description: '', type: formData.type, 
        amount: '', itemList: '', comment: '' 
      });
      setFile(null);
      setLocation(null);
    } catch (err) {
      alert('Помилка! ' + (err.response?.data?.msg || 'Сталася помилка.'));
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
          <AnimatedPage>
            
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
                    <option value="aid">Гуманітарна допомога (речі)</option>
                    <option value="volunteering">Волонтерське завдання</option>
                    <option value="other">Інше</option>
                  </select>
                </div>

                {formData.type === 'donation' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="amount">Сума (в грн)</label>
                      <input type="number" id="amount" name="amount" className="neumorph-input" value={formData.amount} onChange={onChange} placeholder="Напр: 500" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Опис</label>
                      <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange} placeholder="Опис донату"></textarea>
                    </div>
                  </>
                )}
                
                {formData.type === 'aid' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="itemList">Перелік (Що саме ви передали?) - (ОБОВ'ЯЗКОВО)</label>
                      <textarea id="itemList" name="itemList" className="neumorph-textarea" value={formData.itemList} onChange={onChange} placeholder="Напр: 5 турнікетів, 2 коробки ліків..." required />
                    </div>
                    <div className="form-group">
                      <label>Місце передачі (опціонально)</label>
                      <div className={`map-placeholder ${location ? 'map-active' : ''}`} onClick={() => setIsMapOpen(true)}>
                        {location ? (
                          <>
                            <div className="map-preview">
                              <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} dragging={false} zoomControl={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[location.lat, location.lng]}></Marker>
                              </MapContainer>
                            </div>
                            <div className="map-preview-text">
                              <span className="selected-text">✅ Точку обрано!</span>
                            </div>
                          </>
                        ) : ( <span>Натисніть, щоб обрати<br/>точку на карті</span> )}
                      </div>
                    </div>
                  </>
                )}
                
                {(formData.type === 'volunteering') && (
                  <>
                    <div className="form-group">
                      <label htmlFor="description">Опис</label>
                      <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange} placeholder="Опис зробленої роботи"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Місце активності</label>
                      <div className={`map-placeholder ${location ? 'map-active' : ''}`} onClick={() => setIsMapOpen(true)}>
                        {location ? (
                          <>
                            <div className="map-preview">
                              <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} dragging={false} zoomControl={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[location.lat, location.lng]}></Marker>
                              </MapContainer>
                            </div>
                            <div className="map-preview-text">
                              <span className="selected-text">✅ Точку обрано!</span>
                            </div>
                          </>
                        ) : ( <span>Натисніть, щоб обрати<br/>точку на карті</span> )}
                      </div>
                    </div>
                  </>
                )}
                
                {formData.type === 'other' && (
                  <div className="form-group">
                    <label htmlFor="description">Опис</label>
                    <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange}></textarea>
                  </div>
                )}

                <div className="form-group">
                  <label>Підтвердження (PDF або Фото)</label>
                  <label htmlFor="proofFile" className={`neumorph-file-input ${file ? 'file-selected' : ''}`}>
                    <span>📁 </span>
                  {file ? file.name : 'Натисніть, щоб обрати фото/файли'}
                  <input type="file" id="proofFile" onChange={onFileChange} />
                  </label>
                </div>
                
                <div className="form-group">
                  <label htmlFor="comment">Коментар</label>
                  <input type="text" id="comment" name="comment" className="neumorph-input" value={formData.comment} onChange={onChange} placeholder="Будь-яка доп. інформація..."/>
                </div>
                
                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />
                <button type="submit" className="neumorph-button">
                  Відправити на верифікацію
                </button>
              </form>
            </div>
          </AnimatedPage>
        </main>
      </div>
    </>
  );
};

export default AddHelpPage;