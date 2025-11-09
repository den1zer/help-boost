const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { registerUser, loginUser } = require('../controllers/authController');

router.post(
  '/register',
  [
    body('username', 'Username є обов\'язковим').not().isEmpty(),
    body('email', 'Введіть коректний email').isEmail(),
    body('password', 'Пароль має бути мін. 6 символів').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Введіть email').isEmail(),
    body('password', 'Пароль є обов\'язковим').exists(),
  ],
  validate,
  loginUser
);
module.exports = router;