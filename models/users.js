const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const validator = require('validator');

// Creating user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Имя пользователя',
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Creates model
module.exports = mongoose.model('user', userSchema);
