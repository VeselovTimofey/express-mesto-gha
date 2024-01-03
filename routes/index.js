const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/not_found');
const error = require('../middlewares/error');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFound());
});

router.use('*', error);

module.exports = router;
