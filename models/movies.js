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

  trailerLink: {
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

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // contained in the filmsdb service response
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
