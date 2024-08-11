import playerAttributes from '../utils/playerAttributes.js';

export default class PlayerSelectorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerSelectorScene' });
    }

    preload() {
        this.load.image('player-1', 'assets/player-1.png');
        this.load.image('player-2', 'assets/player-2.png');
        this.load.image('player-3', 'assets/player-3.png');
        this.load.image('player-4', 'assets/player-4.png');
        this.load.image('player-5', 'assets/player-5.png');
    }

    create() {
        document.getElementById('player-selector-container').innerHTML = `
            <div class="player-selector">
                <h1>Select Your Player</h1>
                <table id="player-attributes-table">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Speed</th>
                            <th>Health</th>
                        </tr>
                    </thead>
                    <tbody id="player-attributes-list">
                        ${this.generatePlayerAttributesTable()}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('main-menu-container').style.display = 'none';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('player-selector-container').style.display = 'flex';

        // Add event listeners to player avatars in the table
        document.querySelectorAll('.player-icon-small').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const playerId = event.target.dataset.playerId;
                this.selectPlayer(playerId);
            });
        });
    }

    generatePlayerAttributesTable() {
        return Object.keys(playerAttributes).map(playerId => {
            const { speed, health } = playerAttributes[playerId];
            return `
                <tr>
                    <td><img src="assets/${playerId}.png" alt="${playerId}" class="player-icon-small" data-player-id="${playerId}"></td>
                    <td>${speed}</td>
                    <td>${health}</td>
                </tr>
            `;
        }).join('');
    }

    selectPlayer(playerId) {
        console.log('Selected player:', playerId);
        // Save the selected player to a global variable or state
        window.selectedPlayer = playerId;
        document.getElementById('selected-player-icon').src = `assets/${playerId}.png`;
        document.getElementById('selected-player-icon').style.display = 'block';
        this.backToMenu();
    }

    backToMenu() {
        document.getElementById('main-menu-container').style.display = 'flex';
        document.getElementById('highscores-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('player-selector-container').style.display = 'none';
        this.scene.start('MainMenuScene'); // Ensure to start the MainMenuScene
    }
}
