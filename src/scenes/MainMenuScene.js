export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('mainMenu', 'assets/mainMenu.png'); // Preload the main menu background image
    }

    create() {
        // Add the main menu image at the correct position
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'mainMenu');

        document.getElementById('main-menu-container').innerHTML = `
            <div class="menu">
                <img id="selected-player-icon" class="player-icon" style="display: none;">
                <button class="play" onclick="startGame()">Play</button>
                <button onclick="selectPlayer()">Select Player</button>
                <button onclick="viewHighScores()">High Scores</button>
            </div>
        `;

        document.getElementById('main-menu-container').style.display = 'flex';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('player-selector-container').style.display = 'none';

        if (!window.selectedPlayer) {
            const players = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'];
            window.selectedPlayer = players[Math.floor(Math.random() * players.length)];
        }
        document.getElementById('selected-player-icon').src = `assets/${window.selectedPlayer}.png`;
        document.getElementById('selected-player-icon').style.display = 'block';
    }

    // Cleanup on shutdown
    shutdown() {
        document.getElementById('main-menu-container').innerHTML = ''; // Clear content when leaving the scene
    }
}

window.startGame = function () {
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    window.game.scene.start('GameScene');
};

window.selectPlayer = function () {
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('player-selector-container').style.display = 'flex';
    window.game.scene.start('PlayerSelectorScene');
};

window.viewHighScores = function () {
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('highscores-container').style.display = 'flex';
    window.game.scene.start('HighScoresScene');
};
