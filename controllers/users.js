const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { JWT_SECRET } = require('./config');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  // use the method from magnus (one document according to the condition)
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Email уже зарегистрирован');
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

    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, '+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверный логин или пароль'));
      }
      // checking password (use bcrypt compare function)
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) {
            return next(new UnauthorizedError('Неверный логин или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      // find out state of the system
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
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
    .catch(() => next(new UnauthorizedError('Неверный логин или пароль')));
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
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
