const Tag = require('../models/Tag');
const Task = require('../models/Task');
const Note = require('../models/Note');

// @desc    Get all tags for a user
// @route   GET /api/tags
// @access  Private
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find({ user: req.user.id })
            .sort({ usageCount: -1, createdAt: -1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single tag
// @route   GET /api/tags/:id
// @access  Private
const getTag = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new tag
// @route   POST /api/tags
// @access  Private
const createTag = async (req, res) => {
    try {
        const { name, color, description } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Tag name is required' });
        }

        // Check if tag already exists for this user
        const existingTag = await Tag.findOne({
            user: req.user.id,
            name: name.trim().toLowerCase()
        });

        if (existingTag) {
            return res.status(400).json({ message: 'Tag with this name already exists' });
        }

        const tag = new Tag({
            user: req.user.id,
            name: name.trim(),
            color: color || '#8b5cf6',
            description: description || '',
            usageCount: 0,
        });

        const createdTag = await tag.save();
        res.status(201).json(createdTag);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Tag with this name already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Private
const updateTag = async (req, res) => {
    const { name, color, description } = req.body;

    try {
        const tag = await Tag.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        if (name !== undefined) {
            // Check if new name conflicts with existing tag
            const existingTag = await Tag.findOne({
                user: req.user.id,
                name: name.trim().toLowerCase(),
                _id: { $ne: req.params.id }
            });

            if (existingTag) {
                return res.status(400).json({ message: 'Tag with this name already exists' });
            }

            tag.name = name.trim();
        }
        if (color !== undefined) tag.color = color;
        if (description !== undefined) tag.description = description;

        const updatedTag = await tag.save();
        res.json(updatedTag);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Tag with this name already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Private
const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Remove tag from all tasks
        await Task.updateMany(
            { user: req.user.id, tags: tag.name },
            { $pull: { tags: tag.name } }
        );

        // Remove tag from all notes
        await Note.updateMany(
            { user: req.user.id, tags: tag.name },
            { $pull: { tags: tag.name } }
        );

        await tag.deleteOne();
        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tag usage statistics
// @route   GET /api/tags/:id/stats
// @access  Private
const getTagStats = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        const taskCount = await Task.countDocuments({
            user: req.user.id,
            tags: tag.name
        });

        const noteCount = await Note.countDocuments({
            user: req.user.id,
            tags: tag.name
        });

        res.json({
            tag: tag,
            taskCount,
            noteCount,
            totalUsage: taskCount + noteCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    getTagStats,
};
