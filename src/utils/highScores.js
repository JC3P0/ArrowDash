// src/utils/highScores.js
import { getHighScores, requestHighScoreToken, saveHighScore } from '../api/highscores.js';

export async function loadHighScores(scene) {
    try {
        scene.highscores = await getHighScores();
    } catch (error) {
        console.error('Error loading high scores:', error);
    }
}

export async function checkAndSaveHighScore(scene, playerName, score, level, avatar) {
    try {
        const token = await requestHighScoreToken(playerName, score);
        if (token) {
            await saveHighScore({ token, player: playerName, score, level, avatar });
            console.log(`High score saved for player: ${playerName}, score: ${score}, level: ${level}, avatar: ${avatar}`);
        }
    } catch (error) {
        console.error('Error saving high score:', error);
    }
}
