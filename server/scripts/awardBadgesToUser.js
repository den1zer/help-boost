const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const BADGE_DICTIONARY = [
  {
    badgeId: 'points_master', triggerType: 'POINTS',
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
  },
  {
    badgeId: 'donator', triggerType: 'DONATION_COUNT',
    levels: [
      { level: 1, name: 'Перший Донат', value: 1, icon: '❤️' },
      { level: 2, name: 'Щедрий Донатор', value: 5, icon: '💰' },
      { level: 3, name: 'Меценат', value: 10, icon: '🏦' },
      { level: 4, name: 'Інвестор Перемоги', value: 25, icon: '💎' },
    ],
  },
  {
    badgeId: 'volunteer', triggerType: 'VOLUNTEER_COUNT',
    levels: [
      { level: 1, name: 'Перша Справа', value: 1, icon: '💪' },
      { level: 2, name: 'Активіст', value: 5, icon: '🛠️' },
      { level: 3, name: 'Лідер Руху', value: 10, icon: '🚀' },
    ],
  },
  {
    badgeId: 'aid_worker', triggerType: 'AID_COUNT',
    levels: [
      { level: 1, name: 'Перша Посилка', value: 1, icon: '📦' },
      { level: 2, name: 'Надійний Тип', value: 5, icon: '🚚' },
      { level: 3, name: 'Ангел Логістики', value: 10, icon: '✈️' },
    ],
  },
  {
    badgeId: 'versatile', triggerType: 'VERSATILE',
    levels: [{ level: 1, name: 'Майстер на всі руки', value: 1, icon: '🧑‍🔧' }],
  },
  {
    badgeId: 'profile_complete', triggerType: 'PROFILE',
    levels: [{ level: 1, name: 'Представся!', value: 1, icon: '🆔' }],
  },
  {
    badgeId: 'streak_3_days', triggerType: 'STREAK',
    levels: [{ level: 1, name: 'Ударник', value: 3, icon: '⚡' }],
  },
  {
    badgeId: 'high_roller', triggerType: 'HIGH_POINTS',
    levels: [{ level: 1, name: 'Хайролер', value: 1, icon: '💥' }],
  },
  {
    badgeId: 'geo_tagger', triggerType: 'GEO',
    levels: [{ level: 1, name: 'Картограф', value: 5, icon: '🗺️' }],
  },
  {
    badgeId: 'first_rejection', triggerType: 'REJECTED',
    levels: [{ level: 1, name: 'Не здавайся!', value: 1, icon: '🤕' }],
  },
];

async function awardBadgesToUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email: 'denizershar@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    // Set stats to max to trigger all badges
    user.points = 30000;
    user.stats.totalDonations = 25;
    user.stats.totalVolunteering = 10;
    user.stats.totalAid = 10;
    user.stats.totalGeo = 5;
    user.stats.totalRejections = 1;
    user.stats.hasDonation = true;
    user.stats.hasVolunteering = true;
    user.stats.hasAid = true;
    user.stats.profileComplete = true;
    user.stats.highRoller = true;

    // Clear existing badges
    user.badges = [];

    // Add all badges at max level
    BADGE_DICTIONARY.forEach(badgeDef => {
      const maxLevel = badgeDef.levels[badgeDef.levels.length - 1];
      user.badges.push({
        badgeId: badgeDef.badgeId,
        level: maxLevel.level,
        name: maxLevel.name,
        icon: maxLevel.icon,
        date: new Date(),
      });
    });

    await user.save();
    console.log('Badges awarded to user denizershar@gmail.com');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

awardBadgesToUser();
