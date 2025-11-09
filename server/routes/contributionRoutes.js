const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); 
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { 
  addContribution,
  getPendingContributions,
  approveContribution,
  rejectContribution,
  getMyContributions
} = require('../controllers/contributionController');

router.post(
  '/add', 
  [ 
    isAuthenticated, 
    uploadMiddleware.single('proofFile'),
    body('title', 'Заголовок є обов\'язковим').not().isEmpty(),
    body('type', 'Тип є обов\'язковим').isIn(['donation', 'volunteering', 'aid', 'other']),
    body('amount').if(body('type').equals('donation')).isNumeric().withMessage('Сума має бути числом'),
    body('itemList').if(body('type').equals('aid')).not().isEmpty().withMessage('Перелік є обов\'язковим'),
  ],
  validate,
  addContribution
);

router.get('/pending', [ isAuthenticated, isAdmin ], getPendingContributions);
router.put('/approve/:id', [ isAuthenticated, isAdmin ], approveContribution);
router.put('/reject/:id', [ isAuthenticated, isAdmin ], rejectContribution);
router.get('/my', isAuthenticated, getMyContributions);

module.exports = router;