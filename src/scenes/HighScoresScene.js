// src/scenes/HighScoresScene.js

import { getHighScores } from '../api/highscores.js';

export default class HighScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScoresScene' });
    }

    preload() {
        // No assets to preload for this scene
    }

    create() {
        document.getElementById('highscores-container').innerHTML = `
            <div class="highscores">
                <h1>High Scores</h1>
                <div id="highscores-list">Loading...</div>
                <button onclick="backToMenu()">Back</button>
            </div>
        `;

        document.getElementById('main-menu-container').style.display = 'none';
        document.getElementById('highscores-container').style.display = 'flex';
        document.getElementById('game-container').style.display = 'none';

        this.showHighScores();
    }

    async showHighScores() {
        try {
            const highscores = await getHighScores();
            const highscoresList = document.getElementById('highscores-list');
            highscoresList.innerHTML = '';

            if (highscores.length === 0) {
                highscoresList.textContent = 'No high scores available.';
            } else {
                highscores.forEach((score, index) => {
                    const scoreItem = document.createElement('div');
                    scoreItem.textContent = `${index + 1}. ${score.player}: ${score.score}`;
                    highscoresList.appendChild(scoreItem);
                });
            }
        } catch (error) {
            console.error('Error fetching high scores:', error);
            document.getElementById('highscores-list').textContent = 'Failed to load high scores.';
        }
    }
}

window.backToMenu = function () {
    document.getElementById('main-menu-container').style.display = 'flex';
    document.getElementById('highscores-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
};
