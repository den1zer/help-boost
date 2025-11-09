const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- "ЧОТКИЙ" ФІКС: "Докидаємо" 'userId' ---
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Користувач з таким email вже існує' });
    }
    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role, 
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // "ЧОТКО" "КИДАЄМО" 'userId'
        res.status(201).json({ token, role: user.role, userId: user.id }); 
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};

// --- "ЧОТКИЙ" ФІКС: "Докидаємо" 'userId' ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).select('+password'); // "Чотко" "тягнемо" "пароль"
    if (!user) {
      return res.status(400).json({ msg: 'Невірні дані для входу' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Невірні дані для входу' });
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // "ЧОТКО" "КИДАЄМО" 'userId'
        res.json({ token, role: user.role, userId: user.id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};