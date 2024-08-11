// levelManager.js

export function setLevelBackground(scene) {
    if (scene.level === 10) {
        scene.background.setTexture('level-10');
        
        // Reset the player position
        scene.player.setPosition(400, 500);  // Set to the initial position
        scene.player.setVelocity(0, 0); // Ensure the player is not moving
        scene.isMoving = false; // Stop any current movement
    }
}
