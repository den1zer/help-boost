const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { 
  createFundraiser, 
  getAllFundraisers, 
  simulateDonation 
} = require('../controllers/fundraiserController');

router.post('/', [isAuthenticated, isAdmin], createFundraiser);

router.get('/', isAuthenticated, getAllFundraisers);

router.post('/:id/donate', isAuthenticated, simulateDonation);

module.exports = router;