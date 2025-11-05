// server/routes/skinRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { getAllSkins } = require('../controllers/skinController');

// @route   GET api/skins
router.get('/', isAuthenticated, getAllSkins);

module.exports = router;