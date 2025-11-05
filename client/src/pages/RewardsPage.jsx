import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css';
import '../styles/RewardsPage.css';

const BADGE_DICTIONARY = [
  {
    badgeId: 'points_master', triggerType: 'POINTS',
    description: 'Видається за досягнення певної кількості балів.',
    levels: [
      { level: 1, name: 'Новачок', value: 500, icon: '🥉' },
      { level: 2, name: 'Спеціаліст', value: 1000, icon: '🥈' },
      { level: 3, name: 'Профі', value: 3000, icon: '🥇' },
      { level: 4, name: 'Експерт', value: 5000, icon: '⭐' },
      { level: 5, name: 'Майстер', value: 10000, icon: '🏆' },
      { level: 6, name: 'Грандмайстер', value: 15000, icon: '💎' },
      { level: 7, name: 'Легенда', value: 20000, icon: '🔥' },
      { level: 8, name: 'Semigod', value: 30000, icon: '👑' },
    ],
    lockedIcon: '🔒',
  },
  {
    badgeId: 'donator', triggerType: 'DONATION_COUNT',
    description: 'Видається за загальну кількість схвалених донатів.',
    levels: [
      { level: 1, name: 'Перший Донат', value: 1, icon: '❤️' },
      { level: 2, name: 'Щедрий Донатор', value: 5, icon: '💰' },
      { level: 3, name: 'Меценат', value: 10, icon: '🏦' },
      { level: 4, name: 'Інвестор Перемоги', value: 25, icon: '💎' },
    ],
    lockedIcon: '💸',
  },
  {
    badgeId: 'volunteer', triggerType: 'VOLUNTEER_COUNT',
    description: 'Видається за кількість виконаних волонтерських завдань.',
    levels: [
      { level: 1, name: 'Перша Справа', value: 1, icon: '💪' },
      { level: 2, name: 'Активіст', value: 5, icon: '🛠️' },
      { level: 3, name: 'Лідер Руху', value: 10, icon: '🚀' },
    ],
    lockedIcon: '👤',
  },
  {
    badgeId: 'aid_worker', triggerType: 'AID_COUNT',
    description: 'Видається за кількість передач гуманітарної допомоги.',
    levels: [
      { level: 1, name: 'Перша Посилка', value: 1, icon: '📦' },
      { level: 2, name: 'Надійний Тип', value: 5, icon: '🚚' },
      { level: 3, name: 'Ангел Логістики', value: 10, icon: '✈️' },
    ],
    lockedIcon: '🤷',
  },
  {
    badgeId: 'versatile', triggerType: 'VERSATILE',
    description: 'Видається за 1 донат, 1 волонтерство і 1 гум. допомогу.',
    levels: [{ level: 1, name: 'Майстер на всі руки', value: 1, icon: '🧑‍🔧' }],
    lockedIcon: '❓',
  },
  {
    badgeId: 'profile_complete', triggerType: 'PROFILE',
    description: 'Заповніть свій профіль (Аватар, Місто, Вік).',
    levels: [{ level: 1, name: 'Представся!', value: 1, icon: '🆔' }],
    lockedIcon: '❓',
  },
  {
    badgeId: 'streak_3_days', triggerType: 'STREAK',
    description: 'Зробіть 3 внески протягом 3 днів.',
    levels: [{ level: 1, name: 'Ударник', value: 3, icon: '⚡' }],
    lockedIcon: '❓',
  },
  {
    badgeId: 'high_roller', triggerType: 'HIGH_POINTS',
    description: 'Отримайте 1000+ балів за ОДНУ заявку.',
    levels: [{ level: 1, name: 'Хайролер', value: 1, icon: '💥' }],
    lockedIcon: '❓',
  },
  {
    badgeId: 'geo_tagger', triggerType: 'GEO',
    description: 'Додайте 5 заявок з геолокацією.',
    levels: [{ level: 1, name: 'Картограф', value: 5, icon: '🗺️' }],
    lockedIcon: '❓',
  },
  {
    badgeId: 'first_rejection', triggerType: 'REJECTED',
    description: 'Вашу заявку було відхилено. Не здавайтесь!',
    levels: [{ level: 1, name: 'Не здавайся!', value: 1, icon: '🤕' }],
    lockedIcon: '❓',
  },
];

const BadgeDisplay = ({ user, definition }) => {
  const [isFlipped, setIsFlipped] = useState(false); 
  let currentValue = 0;
  if (definition.triggerType === 'POINTS') currentValue = user.points;
  if (definition.triggerType === 'DONATION_COUNT') currentValue = user.stats.totalDonations;
  if (definition.triggerType === 'VOLUNTEER_COUNT') currentValue = user.stats.totalVolunteering;
  if (definition.triggerType === 'AID_COUNT') currentValue = user.stats.totalAid;
  if (definition.triggerType === 'GEO') currentValue = user.stats.totalGeo;
  if (definition.triggerType === 'REJECTED') currentValue = user.stats.totalRejections;
  if (definition.triggerType === 'VERSATILE' && user.stats.hasDonation && user.stats.hasVolunteering && user.stats.hasAid) currentValue = 1;
  if (definition.triggerType === 'PROFILE' && user.stats.profileComplete) currentValue = 1;
  if (definition.triggerType === 'HIGH_ROLLER' && user.stats.highRoller) currentValue = 1;
  let achievedLevel = null;
  for (const level of definition.levels) {
    if (currentValue >= level.value) {
      achievedLevel = level;
    } else {
      break; 
    }
  }
  let nextLevel = null;
  if (achievedLevel) {
    nextLevel = definition.levels.find(l => l.level === achievedLevel.level + 1);
  } else {
    nextLevel = definition.levels[0];
  }
  let progress = 0;
  let progressText = "Макс. рівень";
  if (nextLevel) {
    const startValue = achievedLevel ? achievedLevel.value : 0; 
    const endValue = nextLevel.value; 
    const currentProgressValue = Math.max(0, currentValue - startValue); 
    const totalValue = endValue - startValue;
    if (totalValue > 0) {
      progress = Math.min((currentProgressValue / totalValue) * 100, 100);
    } else if (currentValue >= endValue) {
      progress = 100;
    }
    progressText = `${currentValue} / ${endValue}`;
  } else if (achievedLevel) {
    progress = 100;
  }
  const displayIcon = achievedLevel ? achievedLevel.icon : definition.lockedIcon;
  const displayName = achievedLevel ? achievedLevel.name : definition.levels[0].name;
  const isLocked = !achievedLevel;
  return (
    <motion.div className="badge-card" onClick={() => setIsFlipped(f => !f)}>
      <motion.div className="badge-inner" animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6 }}>
        <div className={`badge-front ${isLocked ? 'badge-locked' : ''}`}>
          <div className="badge-icon">{displayIcon}</div>
          <h3 className="badge-name">{displayName}</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">{progressText}</span>
        </div>
        <div className="badge-back">
          <h3 className="badge-name">{achievedLevel ? achievedLevel.name : definition.levels[0].name}</h3>
          <p className="badge-description">{definition.description}</p>
          <p className="badge-description">
            {achievedLevel ? `Ваш рівень: ${achievedLevel.level}` : (nextLevel ? `Наступна ціль: ${nextLevel.value}` : 'Почніть!')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RewardsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/me', config);
        setUser(res.data);
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchUserData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        <AnimatedPage>
          <div className="rewards-container">
            <h2>Центр Нагород</h2>
            
            {loading && <p>Завантаження вашого прогресу...</p>}
            
            {user && (
              <div className="rewards-grid">
                {BADGE_DICTIONARY.map(def => (
                  <BadgeDisplay key={def.badgeId} user={user} definition={def} />
                ))}
              </div>
            )}
          </div>
        </AnimatedPage>
      </main>
    </div>
  );
};

export default RewardsPage;