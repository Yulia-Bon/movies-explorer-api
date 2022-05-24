const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../controllers/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // checking the availability of the token
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Авторизируйтесь');
  }

  // remove from response "Bearer ,"
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // verify the token or send an error if it fails
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Авторизируйтесь');
  }

  req.user = payload;
  next();
};
module.exports = auth;
