const router = require('express').Router();
const http2 = require('http2');

router.use((req, res, next) => {
  req.user = {
    _id: '658ef7d49f58e88a2681a306',
  };

  next();
});

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Неправильный путь.' });
});

module.exports = router;
