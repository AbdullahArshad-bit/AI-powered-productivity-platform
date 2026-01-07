const express = require('express');
const router = express.Router();
const { 
    getTasks,
    getTaskById,
    createTask, 
    updateTask, 
    deleteTask,
    addAttachment,
    deleteAttachment,
    getTaskDependencies
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, createTask);
// Specific routes must come before parameterized routes
router.route('/:id/dependencies').get(protect, getTaskDependencies);
router.route('/:id/attachments').post(protect, addAttachment);
router.route('/:id/attachments/:attachmentId').delete(protect, deleteAttachment);
// General task routes come last
router.route('/:id').get(protect, getTaskById).put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
