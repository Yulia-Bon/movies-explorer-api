const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const { validateRegist, validateLogin } = require('../middlewares/validator');
const NotFoundError = require('../errors/NotFoundError');
const { pageNotFoundErrorMessage } = require('../utils/constants');

router.post('/signup', validateRegist, createUser);
router.post('/signin', validateLogin, login);
router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('*', () => {
  throw new NotFoundError(pageNotFoundErrorMessage);
});

module.exports = router;
