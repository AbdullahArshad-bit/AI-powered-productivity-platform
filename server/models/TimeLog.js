const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task',
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number, // in minutes
        default: 0,
    },
    notes: {
        type: String,
    },
    type: {
        type: String,
        enum: ['work', 'break', 'pomodoro'],
        default: 'work',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('TimeLog', timeLogSchema);
