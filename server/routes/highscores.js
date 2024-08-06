// server/routes/highscores.js
const express = require('express');
const router = express.Router();
const Highscore = require('../models/Highscore');

// Get top 10 highscores
router.get('/', async (req, res) => {
    try {
        const highscores = await Highscore.find().sort({ score: -1 }).limit(10);
        res.json(highscores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new highscore
router.post('/', async (req, res) => {
    const { player, score } = req.body;
    const newHighscore = new Highscore({
        player,
        score
    });

    try {
        const savedHighscore = await newHighscore.save();
        res.status(201).json(savedHighscore);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
