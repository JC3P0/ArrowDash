// src/api/highscores.js
const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

export async function getHighScores() {
    try {
        const response = await window.axios.get(`${API_URL}/highscores`);
        return response.data;
    } catch (error) {
        console.error('Error fetching high scores:', error);
        throw error;
    }
}

export async function saveHighScore(player, score) {
    try {
        await window.axios.post(`${API_URL}/highscores`, { player, score });
    } catch (error) {
        console.error('Error saving high score:', error);
        throw error;
    }
}
