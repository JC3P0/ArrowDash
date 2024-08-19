import { preload } from '../utils/preload.js';
import { getHighScores } from '../api/highscores.js';

export default class HighScoresScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HighScoresScene' });
    }

    async preload() {
        await preload(this);
    }

    create() {
        document.querySelector('canvas').style.display = 'none';
        document.getElementById('highscores-container').innerHTML = `
            <div class="highscores">
                <h1>High Scores</h1>
                <table id="highscores-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Avatar</th>
                            <th>Score</th>
                            <th>Level</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="highscores-list">
                        <tr><td colspan="6">Loading...</td></tr>
                    </tbody>
                </table>
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
            highscoresList.innerHTML = ''; // Clear the "Loading..." message

            if (highscores.length === 0) {
                highscoresList.innerHTML = '<tr><td colspan="6">No high scores available.</td></tr>';
            } else {
                highscores.forEach((score, index) => {
                    const formattedScore = this.formatHighScore(index + 1, score);
                    const scoreItem = document.createElement('tr');
                    scoreItem.innerHTML = formattedScore;
                    highscoresList.appendChild(scoreItem);
                });
            }
        } catch (error) {
            console.error('Error fetching high scores:', error);
            document.getElementById('highscores-list').innerHTML = '<tr><td colspan="6">Failed to load high scores.</td></tr>';
        }
    }

    formatHighScore(rank, { player, score, level, avatar, date }) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        });

        // Use cached images from Phaser's texture cache
        const avatarImage = this.textures.getBase64(`player-${avatar}`);

        return `
            <td>${String(rank).padStart(2, '0')}</td>
            <td>${player}</td>
            <td><img src="${avatarImage}" alt="Avatar ${avatar}" style="width: 32px; height: 32px;"></td>
            <td>${score}</td>
            <td>${level}</td>
            <td>${formattedDate}</td>
        `;
    }
}

window.backToMenu = function () {
    document.getElementById('main-menu-container').style.display = 'flex';
    document.getElementById('highscores-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
};
