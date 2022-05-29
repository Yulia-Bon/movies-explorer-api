const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_SECRET } = process.env;

  // checking the availability of the token
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // remove from response "Bearer ,"
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // verify the token or send an error if it fails
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Неверный токен');
  }

  req.user = payload;
  next();
};
module.exports = auth;
