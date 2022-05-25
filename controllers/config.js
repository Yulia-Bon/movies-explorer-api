require('dotenv').config();

module.exports = {
  PORT: 3001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/moviesdb',
};
