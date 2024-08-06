// src/scenes/PlayerSelectorScene.js

export default class PlayerSelectorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerSelectorScene' });
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('icon1', 'assets/icon1.png'); // Add your player icons to the assets folder
        this.load.image('icon2', 'assets/icon2.png');
        // Add more icons as needed
    }

    create() {
        this.add.image(400, 300, 'sky');

        this.add.text(400, 100, 'Select Your Player', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5);

        // Example icons
        const icon1 = this.add.image(300, 300, 'icon1')
            .setInteractive()
            .on('pointerdown', () => this.selectPlayer('icon1'));

        const icon2 = this.add.image(500, 300, 'icon2')
            .setInteractive()
            .on('pointerdown', () => this.selectPlayer('icon2'));

        // Add more icons as needed
    }

    selectPlayer(iconKey) {
        // Save the selected player icon key (you can save this to a global variable or state)
        console.log('Selected player:', iconKey);
        this.scene.start('MainMenuScene'); // Return to the main menu or start the game
    }
}
