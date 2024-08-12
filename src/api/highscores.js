// src/api/highscores.js
const API_URL = 'http://localhost:3000';

export async function getHighScores() {
    try {
        const response = await window.axios.get(`${API_URL}/highscores`);
        return response.data;
    } catch (error) {
        console.error('Error fetching high scores:', error);
        throw error;
    }
}

export async function requestHighScoreToken(player, score) {
    try {
        const response = await window.axios.post(`${API_URL}/highscores/token`, { player, score });
        return response.data.token;
    } catch (error) {
        console.error('Error requesting high score token:', error.response.data);
        throw error;
    }
}

export async function saveHighScore({ token, player, score, level, avatar }) {
    try {
        const response = await window.axios.post(`${API_URL}/highscores`, { token, player, score, level, avatar });
        return response.data;
    } catch (error) {
        console.error('Error saving high score:', error.response.data); // Log the detailed error message
        throw error;
    }
}
