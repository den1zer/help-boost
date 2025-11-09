const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { 
  createTicket, 
  createFeedback, 
  getOpenTickets,
  getAllFeedback
} = require('../controllers/supportController');

router.post(
  '/ticket', 
  [
    body('name', 'Ім\'я є обов\'язковим').not().isEmpty(),
    body('email', 'Введіть коректний email').isEmail(),
    body('question', 'Питання є обов\'язковим').not().isEmpty(),
  ],
  validate,
  createTicket
);

router.post(
  '/feedback', 
  isAuthenticated,
  [
    body('rating', 'Рейтинг (1-5) є обов\'язковим').isInt({ min: 1, max: 5 }),
  ],
  validate,
  createFeedback
);

router.get('/tickets', [isAuthenticated, isAdmin], getOpenTickets);
router.get('/feedback', [isAuthenticated, isAdmin], getAllFeedback);

module.exports = router;