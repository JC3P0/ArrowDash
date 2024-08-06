// src/utils/gameUtils.js

import { getHighScores, saveHighScore } from '../api/highscores.js';

export function generateSequence() {
    const directions = ['left', 'right', 'up', 'down'];
    const sequence = [];
    for (let i = 0; i < 10; i++) {
        sequence.push(directions[Math.floor(Math.random() * directions.length)]);
    }
    console.log('Arrow Sequence:', sequence);
    return sequence;
}

export function displaySequence(scene) {
    const arrowImages = {
        up: 'arrow_up_blue',
        down: 'arrow_down_blue',
        left: 'arrow_left_blue',
        right: 'arrow_right_blue'
    };

    const startX = 50;
    const startY = 550;
    const spacing = 50;

    scene.arrowSequence.forEach((direction, index) => {
        if (arrowImages[direction]) {
            let arrow = scene.add.image(startX + index * spacing, startY, arrowImages[direction]);
            scene.arrows.push(arrow);
        } else {
            console.error(`Invalid direction: ${direction}`);
        }
    });
}

export function updateArrowColor(scene, index, direction) {
    const arrowImages = {
        left: 'arrow_left_green',
        right: 'arrow_right_green',
        up: 'arrow_up_green',
        down: 'arrow_down_green'
    };

    scene.arrows[index].setTexture(arrowImages[direction]);
}

export function gameOver(scene) {
    alert('Game Over! Your score: ' + scene.score);
    scene.score = 0;
    scene.currentIndex = 0;
    scene.arrowSequence = [];
    scene.arrows = [];
    scene.arrowSequence = generateSequence();
    displaySequence(scene);
}

export function promptForHighScore(scene) {
    let playerName = prompt('Enter your name:').toUpperCase();
    playerName = playerName.replace(/[^A-Z]/g, '').substring(0, 6);
    if (playerName.length >= 3 && playerName.length <= 6) {
        checkAndSaveHighScore(scene, playerName, scene.score);
    } else {
        alert('Name must be between 3 and 6 characters and contain only letters.');
    }
}

async function checkAndSaveHighScore(scene, player, score) {
    try {
        let highscores = await getHighScores();

        if (highscores.length < 10 || score > highscores[highscores.length - 1].score) {
            if (highscores.length >= 10) {
                highscores.pop();
            }
            highscores.push({ player, score });
            highscores.sort((a, b) => b.score - a.score);

            await saveHighScore(player, score);
            displayHighScores(scene, scene.highScoresText); // Pass the highScoresText here
        } else {
            alert('Your score is not high enough to be in the top 10.');
        }
    } catch (error) {
        console.error('Error saving high score:', error);
    }
}

export async function displayHighScores(scene, textObject) {
    try {
        const highscores = await getHighScores();
        let text = 'High Scores:\n';
        highscores.forEach((score, index) => {
            text += `${index + 1}. ${score.player}: ${score.score}\n`;
        });
        textObject.setText(text);
    } catch (error) {
        console.error('Error fetching high scores:', error);
        textObject.setText('Failed to load high scores.');
    }
}
