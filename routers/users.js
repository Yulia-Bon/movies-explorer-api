const router = require('express').Router();

const controller = require('../controllers/users');

router.get('/', controller.getUsers);
router.get('/me', controller.getUserInfo);

module.exports = router;
