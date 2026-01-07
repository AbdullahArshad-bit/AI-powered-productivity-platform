const express = require('express');
const router = express.Router();
const {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    getTagStats,
} = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTags)
    .post(protect, createTag);

router.route('/:id')
    .get(protect, getTag)
    .put(protect, updateTag)
    .delete(protect, deleteTag);

router.route('/:id/stats')
    .get(protect, getTagStats);

module.exports = router;
