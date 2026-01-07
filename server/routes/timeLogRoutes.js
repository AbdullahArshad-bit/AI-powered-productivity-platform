const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    startTimeLog,
    stopTimeLog,
    getActiveTimeLog,
    getTaskTimeLogs,
    getTimeLogs,
} = require('../controllers/timeLogController');

router.post('/start', protect, startTimeLog);
router.post('/stop/:id', protect, stopTimeLog);
router.get('/active', protect, getActiveTimeLog);
router.get('/task/:taskId', protect, getTaskTimeLogs);
router.get('/', protect, getTimeLogs);

module.exports = router;
