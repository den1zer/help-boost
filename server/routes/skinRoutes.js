const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { getAllSkins } = require('../controllers/skinController');

router.get('/', isAuthenticated, getAllSkins);

module.exports = router;