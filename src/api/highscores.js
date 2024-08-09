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

export async function saveHighScore({ player, score, level, avatar }) {
    try {
        const response = await window.axios.post(`${API_URL}/highscores`, { player, score, level, avatar });
        return response.data;
    } catch (error) {
        console.error('Error saving high score:', error.response.data); // Log the detailed error message
        throw error;
    }
}
