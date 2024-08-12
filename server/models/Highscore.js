const mongoose = require('mongoose');

const HighscoreSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 8,
        uppercase: true,
        match: /^[A-Z0-9]+$/ // Updated to allow uppercase letters and numbers
    },
    score: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    avatar: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Highscore', HighscoreSchema);
