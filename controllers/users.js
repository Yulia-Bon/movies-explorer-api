const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const NotExistError = require('../errors/UnauthorizedError');
const AlreadyExistError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

const {
  emailErrorMessage,
  regErrorMessage,
  loginErrorMessage,
  userUpdateErrorMessage,
  idNotFoundErrorMessage,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  // use the method from magnus (one document according to the condition)
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AlreadyExistError(emailErrorMessage);
      }
      // use for secure storage of passwords
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.send({
        name,
        email,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(regErrorMessage));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, '+password')
    .then((user) => {
      if (!user) {
        return next(new NotExistError(loginErrorMessage));
      }
      // checking password (use bcrypt compare function)
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) {
            return next(new NotExistError(loginErrorMessage));
          }
          return user;
        });
    })
    .then((user) => {
      // find out state of the system
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('token', token);
      res.send({ jwt: token });
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  // update according to the arg and returns the found document to callback
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(userUpdateErrorMessage));
      }
      if (err.code === 11000) {
        next(new AlreadyExistError(emailErrorMessage));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .orFail(() => {
      throw new NotFoundError(idNotFoundErrorMessage);
    })
    .then((user) => {
      const { name, email } = user;
      const userData = { name, email };

      res.send(userData);
    })
    .catch(next);
};
module.exports = {
  createUser,
  updateProfile,
  login,
  getUserInfo,
};
