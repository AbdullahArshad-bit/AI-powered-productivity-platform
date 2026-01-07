const express = require('express');
const router = express.Router();
const { breakdownTask, chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/breakdown', protect, breakdownTask);
router.post('/chat', protect, chatWithAI);

module.exports = router;
