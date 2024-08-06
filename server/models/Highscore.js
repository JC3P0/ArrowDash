// server/models/Highscore.js
const mongoose = require('mongoose');

const HighscoreSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 6,
        uppercase: true,
        match: /^[A-Z]+$/
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Highscore', HighscoreSchema);
