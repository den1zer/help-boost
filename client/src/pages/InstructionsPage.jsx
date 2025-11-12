import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css'; 
import '../styles/SupportPage.css'; 

const InstructionsPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <AnimatedPage>
          <div className="support-container">
            <h2>Інструкція Користувача</h2>
            
            <div className="neumorph-card" style={{ padding: '25px 30px', lineHeight: 1.6 }}>
              <h3>1. Як це працює?</h3>
              <p>Наша платформа гейміфікує вашу допомогу. Ви додаєте докази своєї активності (донати, волонтерство), адмін їх перевіряє, і ви отримуєте бали.</p>
              
              <h3>2. Нарахування Балів</h3>
              <p>Бали нараховуються ТІЛЬКИ після схвалення вашої заявки адміном. За замовчуванням кожна заявка = 100 балів, але адмін може нарахувати більше за значний внесок.</p>
              
              <h3>3. Нагороди (Бейджі)</h3>
              <p>Нагороди видаються АВТОМАТИЧНО, коли ви досягаєте певної мети. Наприклад, "Перший Донат" (за 1 донат) або "Експерт" (за 5000 балів). Ви можете відслідковувати свій прогрес на сторінці "Нагороди".</p>
              
              <h3>4. Статуси Заявок</h3>
              <ul>
                <li><strong>Pending (Чекає):</strong> Адмін ще не бачив вашу заявку.</li>
                <li><strong>Approved (Схвалено):</strong> "Бали нараховано.</li>
                <li><strong>Rejected (Відхилено):</strong> Щось не  так. Зайдіть в "Мої Заявки", щоб прочитати коментар адміна (напр. "Треба дійсне фото").</li>
              </ul>
            </div>
            
          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};

export default InstructionsPage;