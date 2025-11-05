const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); 
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { 
  addContribution,
  getMyContributions,
  getPendingContributions, 
  approveContribution,      
  rejectContribution        
  
} = require('../controllers/contributionController');

router.post(
  '/add', 
  [ isAuthenticated, uploadMiddleware.single('proofFile') ], 
  addContribution
);

router.get(
  '/my',
  isAuthenticated, 
  getMyContributions
);
router.get(
  '/pending',
  [ isAuthenticated, isAdmin ], 
  getPendingContributions
);

router.put(
  '/approve/:id',
  [ isAuthenticated, isAdmin ], 
  approveContribution
);

router.put(
  '/reject/:id',
  [ isAuthenticated, isAdmin ], 
  rejectContribution
);

module.exports = router;