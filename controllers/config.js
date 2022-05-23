module.exports = {
  PORT: 3000,
  JWT_SECRET:
    process.env.NODE_ENV !== 'production' ? 'JWT_SECRET' : process.env.JWT_SECRET,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/filmsdb',
};
