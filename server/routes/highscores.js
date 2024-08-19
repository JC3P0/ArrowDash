const express = require('express');
const jwt = require('jsonwebtoken');
const Highscore = require('../models/Highscore');
const router = express.Router();

// Middleware function to verify the JWT token
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token has already been used
        const existingHighscore = await Highscore.findOne({ token });
        if (existingHighscore) {
            return res.status(400).json({ message: 'Token has already been used' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// GET route to retrieve top 10 highscores
router.get('/', async (req, res) => {
    try {
        const highscores = await Highscore.find().sort({ score: -1 }).limit(10);
        res.status(200).json(highscores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to add a new highscore (protected by JWT)
router.post('/', verifyToken, async (req, res) => {
    const { player, score, level, avatar } = req.user;

    const newHighscore = new Highscore({
        player,
        score,
        level,
        avatar,
        token: req.headers.authorization.split(' ')[1] // Store the token with the highscore
    });

    try {
        const savedHighscore = await newHighscore.save();
        res.status(201).json(savedHighscore);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route to generate a JWT for highscore submission
router.post('/token', (req, res) => {
    const { player, score, level, avatar } = req.body;

    // Ensure that the player, score, level, and avatar are present
    if (!player || !score || !level || !avatar) {
        return res.status(400).json({ message: 'Player, score, level, and avatar are required' });
    }

    // Create a token with the player, score, level, and avatar
    const token = jwt.sign({ player, score, level, avatar }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.status(200).json({ token });
});

module.exports = router;
