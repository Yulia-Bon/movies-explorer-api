const mongoose = require('mongoose');
const { isURL } = require('validator');

// Creating movie schema
const MovieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
    message: 'Поле не соответствует формату URL',
  },

  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
    message: 'Поле не соответствует формату URL',
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
    message: 'Поле не соответствует формату URL',
  },

  // contained in the moviesdb service response /and "_id" and позитив лог  "__v": 0
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  movieId: {
    type: String,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
});

// Creates model
module.exports = mongoose.model('movie', MovieSchema);
