const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware'); 
const { 
  createTask, 
  getOpenTasks,
  getTaskById,  
  claimTask,    
  abandonTask,  
  getMyTasks    
} = require('../controllers/taskController');

router.post(
  '/', 
  [isAuthenticated, isAdmin, uploadMiddleware.single('taskFile')], 
  createTask
);

router.get('/', isAuthenticated, getOpenTasks); 
router.get('/my', isAuthenticated, getMyTasks); 
router.get('/:id', isAuthenticated, getTaskById); 
router.put('/:id/claim', isAuthenticated, claimTask); 
router.put('/:id/abandon', isAuthenticated, abandonTask); 

module.exports = router;