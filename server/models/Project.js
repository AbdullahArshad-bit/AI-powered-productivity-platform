const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    color: {
        type: String,
        default: '#8b5cf6', // Purple default
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active',
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
