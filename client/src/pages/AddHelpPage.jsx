import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import MapPicker from '../components/MapPicker';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; 
import AnimatedPage from '../components/AnimatedPage'; 
import '../styles/Dashboard.css'; 
import '../styles/AddHelpPage.css';
import axios from 'axios';

const useAlertHook = () => ({ showAlert: (message, type) => { alert(message); } });

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AddHelpPage = () => {
  const { showAlert } = useAlertHook();
  const query = useQuery(); 
  const navigate = useNavigate(); 

  const taskId = query.get('taskId');
  const taskTitle = query.get('taskTitle');
  const isTaskSubmission = !!taskId; 

  const [formData, setFormData] = useState({
    title: isTaskSubmission ? `Звіт: ${taskTitle}` : '',
    description: '',
    type: isTaskSubmission ? 'volunteering' : 'donation', 
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
    
    if (!formData.title || formData.title.length < 3) {
      return showAlert('Заголовок має бути мінімум 3 символи.', 'error');
    }
    if (formData.type === 'donation' && (!formData.amount || formData.amount <= 0)) {
      return showAlert('Сума донату має бути більше нуля.', 'error');
    }
    if (formData.type === 'aid' && (!formData.itemList || formData.itemList.length < 5)) {
      return showAlert('Перелік для гум. допомоги обов\'язковий (мін. 5 символів).', 'error');
    }
    if ((formData.type === 'volunteering' || formData.type === 'other') && !isTaskSubmission && (!formData.description || formData.description.length < 5)) {
      return showAlert('Опис обов\'язковий (мін. 5 символів).', 'error');
    }
    if (!file) {
      return showAlert('Будь ласка, прикріпіть файл підтвердження (PDF або Фото).', 'error');
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('amount', formData.amount);
    data.append('itemList', formData.itemList);
    data.append('comment', formData.comment);
    data.append('location', JSON.stringify(location)); 
    if (taskId) data.append('taskId', taskId); 
    data.append('proofFile', file);
    
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      };
      const res = await axios.post('http://localhost:5000/api/contributions/add', data, config);
      
      showAlert(res.data.msg, 'success'); 
      setFormData({ 
        title: '', description: '', type: formData.type, 
        amount: '', itemList: '', comment: '' 
      });
      setFile(null);
      setLocation(null);
      
      if (isTaskSubmission) {
        navigate('/my-contributions'); 
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors[0].msg 
        : (err.response?.data?.msg || 'Сталася помилка.');
      showAlert(errorMsg, 'error');
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
                <h2>{isTaskSubmission ? 'Завантажити Звіт' : 'Додати допомогу'}</h2>

                <div className="form-group">
                  <label htmlFor="title">Заголовок</label>
                  <input type="text" id="title" name="title" className="neumorph-input" value={formData.title} onChange={onChange} />
                </div>

                {!isTaskSubmission && (
                  <div className="form-group">
                    <label htmlFor="type">Тип допомоги</label>
                    <select id="type" name="type" className="neumorph-select" value={formData.type} onChange={onChange}>
                      <option value="donation">Фінансовий донат</option>
                      <option value="aid">Гуманітарна допомога</option>
                      <option value="volunteering">Волонтерство</option>
                      <option value="other">Інше</option>
                    </select>
                  </div>
                )}
                
                {formData.type === 'donation' && !isTaskSubmission && (
                  <>
                    <div className="form-group">
                      <label htmlFor="amount">Сума (в грн)</label>
                      <input type="number" id="amount" name="amount" className="neumorph-input" value={formData.amount} onChange={onChange} placeholder="500" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Опис</label>
                      <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange} placeholder="Деталі..."></textarea>
                    </div>
                  </>
                )}
                
                {formData.type === 'aid' && !isTaskSubmission && (
                  <>
                    <div className="form-group">
                      <label htmlFor="itemList">Перелік (ОБОВ'ЯЗКОВО)</label>
                      <textarea id="itemList" name="itemList" className="neumorph-textarea" value={formData.itemList} onChange={onChange} placeholder="Що саме передали..." />
                    </div>
                    <div className="form-group">
                      <label>Місце передачі</label>
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
                        ) : (
                          <div className="map-preview-text">
                            <span>📍 Натисніть щоб обрати місце</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {(formData.type === 'volunteering' || isTaskSubmission) && (
                  <>
                    <div className="form-group">
                      <label htmlFor="description">Опис</label>
                      <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange} placeholder="Що зробили..."></textarea>
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
                        ) : (
                          <div className="map-preview-text">
                            <span>📍 Натисніть щоб обрати місце</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {formData.type === 'other' && !isTaskSubmission && (
                  <div className="form-group">
                    <label htmlFor="description">Опис</label>
                    <textarea id="description" name="description" className="neumorph-textarea" value={formData.description} onChange={onChange}></textarea>
                  </div>
                )}

                <div className="form-group">
                  <label>Підтвердження (PDF / Фото)</label>
                  <label htmlFor="proofFile" className={`neumorph-file-input ${file ? 'file-selected' : ''}`}>
                    <span>{file ? '✅' : '📁'} </span>
                    {file ? file.name : 'Обрати файл'}
                    <input type="file" id="proofFile" onChange={onFileChange} accept="image/*, application/pdf" />
                  </label>
                </div>
                
                <div className="form-group">
                  <label htmlFor="comment">Коментар</label>
                  <input type="text" id="comment" name="comment" className="neumorph-input" value={formData.comment} onChange={onChange} placeholder="Додаткова інфо..."/>
                </div>
                
                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />
                <button type="submit" className="neumorph-button">
                  Відправити
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