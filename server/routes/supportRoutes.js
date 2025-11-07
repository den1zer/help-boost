// server/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { 
  createTicket, 
  createFeedback, 
  getOpenTickets,
  getAllFeedback
} = require('../controllers/supportController');

router.post('/ticket', createTicket);

router.post('/feedback', isAuthenticated, createFeedback);

router.get('/tickets', [isAuthenticated, isAdmin], getOpenTickets);

router.get('/feedback', [isAuthenticated, isAdmin], getAllFeedback);

module.exports = router;