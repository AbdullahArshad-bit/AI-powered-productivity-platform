const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    summary: {
        type: String, // Artificial Intelligence generated summary
    },
    aiTags: {
        type: [String],
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
