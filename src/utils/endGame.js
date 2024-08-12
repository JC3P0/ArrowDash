// src/utils/endGame.js

import { updateHealthText } from './playerHealth.js';
import { updateArrowColor } from './arrowSequence.js';
import { checkAndSaveHighScore } from './highScores.js';

export async function endGame(scene) {
    scene.isMoving = false;
    scene.player.setVelocity(0, 0);

    if (scene.currentArrowIndex > 0 && scene.currentArrowIndex <= scene.currentArrowSequence.length) {
        const currentArrowDirection = scene.currentArrowSequence[scene.currentArrowIndex - 1];
        updateArrowColor(scene, scene.currentArrowIndex - 1, currentArrowDirection);
    }

    const healthIcons = {
        full: '❤️',
        empty: '♡'
    };
    updateHealthText(scene, healthIcons);

    scene.input.keyboard.removeAllListeners('keydown');

    setTimeout(async () => {
        const playerNameInput = document.getElementById('player-name');
        const submitScoreButton = document.getElementById('submit-score');
        const continueButton = document.getElementById('continue-button');
        const popup = document.getElementById('highscore-popup');
        const popupTitle = document.getElementById('popup-title');
        const popupMessage = document.getElementById('popup-message');

        playerNameInput.value = '';
        popup.style.display = 'flex';

        const lowestHighScore = scene.highscores[scene.highscores.length - 1]?.score || 0;

        if (scene.highscores.length < 10 || scene.score > lowestHighScore) {
            popupTitle.textContent = 'New High Score!';
            popupMessage.textContent = `Your Score: ${scene.score}. Enter your name:`;
            playerNameInput.style.display = 'block';
            submitScoreButton.style.display = 'block';
            continueButton.style.display = 'none';

            const validateInput = (e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                e.target.value = value.substring(0, 8);
            };

            playerNameInput.addEventListener('input', validateInput);

            submitScoreButton.onclick = async () => {
                const playerName = playerNameInput.value.toUpperCase();
                if (playerName.length >= 3 && playerName.length <= 8) {
                    await checkAndSaveHighScore(scene, playerName, scene.score, scene.level, window.selectedPlayer.split('-')[1]);
                    window.location.reload();
                } else {
                    alert('Name must be between 3 and 6 characters and contain only letters or numbers.');
                }
            };
        } else {
            popupTitle.textContent = 'Your Score';
            popupMessage.textContent = `Your score was ${scene.score}. Unfortunately, it did not make it into the top 10. Try again next time!`;
            playerNameInput.style.display = 'none';
            submitScoreButton.style.display = 'none';
            continueButton.style.display = 'block';

            continueButton.onclick = () => {
                window.location.reload();
            };
        }
    }, 100);
}
