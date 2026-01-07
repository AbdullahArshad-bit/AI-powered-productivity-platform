const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        default: '#8b5cf6', // Purple default
    },
    description: {
        type: String,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Ensure unique tag names per user
tagSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Tag', tagSchema);
