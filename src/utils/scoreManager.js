// src/utils/scoreManager.js

export function updateScore(scene, amount) {
    scene.score += amount;
    scene.scoreText.setText('Score:' + scene.score.toString().padStart(6, '0')); // Display up to 100,000
}
