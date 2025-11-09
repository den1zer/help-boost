const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware'); 
const { 
  getUserProfile, 
  getAllUsers, 
  updateUserRole, 
  updateUserProfile,
  getLeaderboard
} = require('../controllers/userController');

router.get('/me', isAuthenticated, getUserProfile);

router.put('/me', [isAuthenticated, uploadMiddleware.single('avatar')], updateUserProfile);

router.get(
  '/leaderboard', 
  isAuthenticated, 
  getLeaderboard
);

router.get('/', [isAuthenticated, isAdmin], getAllUsers);

router.put('/role/:id', [isAuthenticated, isAdmin], updateUserRole);

module.exports = router;