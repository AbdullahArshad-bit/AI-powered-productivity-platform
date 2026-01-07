const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    settings: {
        aiModel: {
            type: String,
            default: 'gpt-3.5-turbo',
        },
        dailySummary: {
            type: Boolean,
            default: false,
        },
    },
    notifications: {
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        taskReminders: {
            type: Boolean,
            default: true,
        },
        projectUpdates: {
            type: Boolean,
            default: true,
        },
        weeklyReports: {
            type: Boolean,
            default: false,
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
