// src/utils/worldBoundsManager.js

export function handleWorldBounds(body, currentDirection) {
    if (body.blocked.up || body.blocked.down) {
        currentDirection.y = -currentDirection.y;
    }
    if (body.blocked.left || body.blocked.right) {
        currentDirection.x = -currentDirection.x;
    }
}
