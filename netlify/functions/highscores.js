const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Highscore = require('../../server/models/Highscore');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL);

// Middleware function to verify the JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

exports.handler = async function (event, context) {
  if (event.httpMethod === 'GET') {
    // Handle GET request: Retrieve top 10 highscores
    try {
      const highscores = await Highscore.find().sort({ score: -1 }).limit(10);
      return {
        statusCode: 200,
        body: JSON.stringify(highscores),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: err.message }),
      };
    }
  } else if (event.httpMethod === 'POST') {
    if (event.path === '/.netlify/functions/highscores/token') {
      // Generate JWT for highscore submission
      const { player, score, level, avatar } = JSON.parse(event.body);

      // Ensure that the player, score, level, and avatar are present
      if (!player || !score || !level || !avatar) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'player, score, level, and avatar are required' }),
        };
      }

      // Create a token with the player, score, level, and avatar information
      const token = jwt.sign({ player, score, level, avatar }, process.env.JWT_SECRET, { expiresIn: '10m' });
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    } else {
      // Add a new highscore (protected by JWT)
      const authHeader = event.headers.authorization;
      if (!authHeader) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: 'Unauthorized' }),
        };
      }

      const token = authHeader.split(' ')[1];
      let user;

      try {
        user = verifyToken(token);
      } catch (err) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: err.message }),
        };
      }

      // Check if the token has already been used
      const existingHighscore = await Highscore.findOne({ token });
      if (existingHighscore) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Token has already been used' }),
        };
      }

      const { player, score, level, avatar } = user;

      const newHighscore = new Highscore({
        player,
        score,
        level,
        avatar,
        token // Store the token in the database
      });

      try {
        const savedHighscore = await newHighscore.save();
        return {
          statusCode: 201,
          body: JSON.stringify(savedHighscore),
        };
      } catch (err) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: err.message }),
        };
      }
    }
  } else {
    // Return 405 Method Not Allowed for unsupported HTTP methods
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
};
