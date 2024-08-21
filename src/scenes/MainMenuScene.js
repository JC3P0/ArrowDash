import { preload } from '../utils/preload.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    async preload() {
        await preload(this);
    }

    create() {
        document.querySelector('canvas').style.display = 'none';
        const mainMenuImageUrl = 'https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/mainMenu.png';

        document.getElementById('main-menu-container').innerHTML = `
            <div class="menu-container">
                <div class="menu-background" style="background-image: url(${mainMenuImageUrl});"></div>
                <div class="menu">
                    <img id="selected-player-icon" class="player-icon" style="display: none;">
                    <button class="play" id="playButton" disabled>Play</button>
                    <button id="selectPlayerButton" disabled>Select Player</button>
                    <button id="viewHighScoresButton" disabled>High Scores</button>
                </div>
            </div>
        `;

        document.getElementById('main-menu-container').style.display = 'flex';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('player-selector-container').style.display = 'none';

        // Set up the selected player icon
        if (!window.selectedPlayer) {
            const players = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'];
            window.selectedPlayer = players[Math.floor(Math.random() * players.length)];
        }

        const playerImageUrl = `https://raw.githubusercontent.com/JC3P0/ArrowDash/main/assets/${window.selectedPlayer}.png`;
        document.getElementById('selected-player-icon').src = playerImageUrl;
        document.getElementById('selected-player-icon').style.display = 'block';

        // Check if all assets are loaded before enabling the buttons
        this.checkAssetsLoaded();
    }

    checkAssetsLoaded() {
        const assetsToCheck = [
            'level-1', 'level-10', 'player-1', 'player-2', 'player-3', 
            'player-4', 'player-5', 'blueUp', 'blueDown', 'blueLeft', 
            'blueRight', 'greenUp', 'greenDown', 'greenLeft', 'greenRight', 
            'xp', 'heart', 'timer'
        ];

        let allLoaded = true;

        assetsToCheck.forEach(asset => {
            if (!this.textures.exists(asset)) {
                allLoaded = false;
            }
        });

        if (allLoaded) {
            this.enableMenuButtons();
        } else {
            // Retry checking after a short delay if not all assets are loaded
            this.time.delayedCall(100, this.checkAssetsLoaded, [], this);
        }
    }

    enableMenuButtons() {
        const playButton = document.getElementById('playButton');
        const selectPlayerButton = document.getElementById('selectPlayerButton');
        const viewHighScoresButton = document.getElementById('viewHighScoresButton');

        playButton.disabled = false;
        selectPlayerButton.disabled = false;
        viewHighScoresButton.disabled = false;

        // Attach the event listeners after enabling the buttons
        playButton.addEventListener('click', startGame);
        selectPlayerButton.addEventListener('click', selectPlayer);
        viewHighScoresButton.addEventListener('click', viewHighScores);
    }

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
