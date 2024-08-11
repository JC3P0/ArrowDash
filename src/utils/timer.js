// src/utils/timer.js

export function startTimer(scene, duration, onTimerComplete) {
    scene.timeLeft = duration;
    scene.timerEvent = scene.time.addEvent({
        delay: 1000,
        callback: () => {
            scene.timeLeft--;
            const minutes = Math.floor(scene.timeLeft / 60);
            const seconds = scene.timeLeft % 60;
            scene.timerText.setText(`⏱${minutes}:${seconds.toString().padStart(2, '0')}`);

            if (scene.timeLeft <= 0) {
                scene.timerEvent.remove(false);
                onTimerComplete();
            }
        },
        loop: true
    });
}
