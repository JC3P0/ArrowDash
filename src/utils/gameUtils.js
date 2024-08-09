// src/utils/gameUtils.js

export function handleWorldBounds(body, currentDirection) {
    // Reverse the direction of velocity when hitting the edge
    if (body.blocked.up || body.blocked.down) {
        currentDirection.y = -currentDirection.y;
    }
    if (body.blocked.left || body.blocked.right) {
        currentDirection.x = -currentDirection.x;
    }
}
