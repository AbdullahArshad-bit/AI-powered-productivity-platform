const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    dueDate: {
        type: Date,
    },
    tags: {
        type: [String],
        default: [],
    },
    // Subtasks
    subtasks: [{
        title: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    }],
    // Task Dependencies
    parentTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    // File Attachments
    attachments: [{
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    // Time Tracking
    estimatedTime: {
        type: Number, // in minutes
        default: 0,
    },
    timeSpent: {
        type: Number, // in minutes
        default: 0,
    },
    timeLogs: [{
        startTime: Date,
        endTime: Date,
        duration: Number, // in minutes
        notes: String,
    }],
    aiMeta: {
        suggestedSteps: [{
            step: String,
            estimateHours: String,
            difficulty: String
        }],
        estimatedTime: Number,
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
