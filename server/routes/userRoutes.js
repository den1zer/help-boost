const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
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

router.put(
  '/me',
  [ 
    isAuthenticated, 
    uploadMiddleware.single('avatar'),
    body('username', 'Username є обов\'язковим').not().isEmpty(),
    body('age').optional({ checkFalsy: true }).isInt({ min: 13 }).withMessage('Вік має бути 13+'),
    body('backupEmail').optional({ checkFalsy: true }).isEmail().withMessage('Резервний email некоректний'),
    body('city').optional().isString(),
    body('gender').optional().isIn(['male', 'female', 'other', 'unspecified']),
  ],
  validate,
  updateUserProfile
);

router.get('/leaderboard', isAuthenticated, getLeaderboard);
router.get('/', [isAuthenticated, isAdmin], getAllUsers);
router.put('/role/:id', [isAuthenticated, isAdmin], updateUserRole);

module.exports = router;