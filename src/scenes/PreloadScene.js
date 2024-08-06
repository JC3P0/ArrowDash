// src/scenes/PreloadScene.js

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        console.log('Preload started');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('arrow_up_blue', 'assets/blueUp.png');
        this.load.image('arrow_down_blue', 'assets/blueDown.png');
        this.load.image('arrow_left_blue', 'assets/blueLeft.png');
        this.load.image('arrow_right_blue', 'assets/blueRight.png');
        this.load.image('arrow_up_green', 'assets/greenUp.png');
        this.load.image('arrow_down_green', 'assets/greenDown.png');
        this.load.image('arrow_left_green', 'assets/greenLeft.png');
        this.load.image('arrow_right_green', 'assets/greenRight.png');
        // this.load.image('icon1', 'assets/icon1.png');
        // this.load.image('icon2', 'assets/icon2.png');
        console.log('Preload finished');
    }

    create() {
        this.scene.start('GameScene'); // Start the GameScene directly
    }
}
