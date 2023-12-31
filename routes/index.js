const router = require('express').Router();
const http2 = require('http2');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Неправильный путь.' });
});

module.exports = router;
