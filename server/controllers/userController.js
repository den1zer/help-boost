const User = require('../models/User');
const { checkAndAwardBadges } = require('./contributionController'); 

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Користувача не знайдено' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, age, backupEmail, city, gender } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Користувача не знайдено' });
    user.username = username || user.username;
    user.age = age || user.age;
    user.backupEmail = backupEmail || user.backupEmail;
    user.city = city || user.city;
    user.gender = gender || user.gender;
    if (req.file) {
      user.avatar = req.file.path;
    }

    if (user.avatar && user.city && user.age) {
      user.stats.profileComplete = true;
    }

    await checkAndAwardBadges(user); 

    await user.save();
    res.json(user); 

  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Цей username або email вже зайнято' });
    }
    res.status(500).send('Помилка на сервері');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== 'user' && role !== 'admin') {
      return res.status(400).json({ msg: 'Невірна роль' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Користувача не знайдено' });
    
    user.role = role;
    await user.save();
    res.json({ msg: 'Роль користувача оновлено' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'user' }) 
      .sort({ points: -1 }) 
      .limit(10) 
      .select('username avatar points level');
    
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};