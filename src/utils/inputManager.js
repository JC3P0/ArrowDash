// src/utils/inputManager.js

import { generateArrowSequence, displaySequence, updateArrowColor } from './arrowSequence.js';
import { updateScore } from './scoreManager.js';
import { loseHealth } from './playerHealth.js';
import { setLevelBackground } from './levelManager.js';

export function handleKey(scene, event) {
    const directionMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = directionMap[event.key];
    if (!newDirection){
        return; // Ignore any key that isn't mapped
    }

    if (newDirection) {
        if ((scene.currentDirection.x + newDirection.x === 0 && scene.currentDirection.y === 0) ||
            (scene.currentDirection.y + newDirection.y === 0 && scene.currentDirection.x === 0)) {
            scene.currentDirection = newDirection;
        } else {
            scene.currentDirection.x += newDirection.x;
            scene.currentDirection.y += newDirection.y;

            const magnitude = Math.sqrt(scene.currentDirection.x ** 2 + scene.currentDirection.y ** 2);
            if (magnitude !== 0) {
                scene.currentDirection.x /= magnitude;
                scene.currentDirection.y /= magnitude;
            }
        }

        scene.lastDirection = newDirection;
        scene.isMoving = true;
    }

    handleArrowSequence(scene, event.key);
}

function handleArrowSequence(scene, key) {
    const currentArrowDirection = scene.currentArrowSequence[scene.currentArrowIndex];
    if (key === `Arrow${currentArrowDirection.charAt(0).toUpperCase() + currentArrowDirection.slice(1)}`) {
        updateArrowColor(scene, scene.currentArrowIndex, currentArrowDirection);
        scene.currentArrowIndex++;
        updateScore(scene, 10);

        if (scene.currentArrowIndex >= scene.currentArrowSequence.length) {
            scene.level++;
            scene.levelText.setText('Level:' + scene.level);

            if (scene.level === 10) {
                setLevelBackground(scene, 10);
            }

            scene.currentArrowSequence = scene.nextArrowSequence;
            scene.nextArrowSequence = generateArrowSequence(10);
            scene.currentArrowIndex = 0;

            scene.arrows.forEach(arrow => arrow.destroy());
            displaySequence(scene, scene.currentArrowSequence, 300);
        }
    } else {
        const healthIcons = {
            full: '❤️',
            empty: '♡'
        };
        loseHealth(scene, healthIcons);
    }
}

// Add swipe detection
export function enableSwipeInput(scene) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    scene.input.on('pointerdown', function (pointer) {
        touchStartX = pointer.x;
        touchStartY = pointer.y;
    });

    scene.input.on('pointerup', function (pointer) {
        touchEndX = pointer.x;
        touchEndY = pointer.y;
        handleSwipe(scene, touchStartX, touchStartY, touchEndX, touchEndY);;
    });
}

function handleSwipe(scene, touchStartX, touchStartY, touchEndX, touchEndY) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            handleKey(scene, { key: 'ArrowRight' });
        } else {
            handleKey(scene, { key: 'ArrowLeft' });
        }
    } else {
        if (deltaY > 0) {
            handleKey(scene, { key: 'ArrowDown' });
        } else {
            handleKey(scene, { key: 'ArrowUp' });
        }
    }
}
