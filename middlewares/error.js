const http2 = require('http2');
const mongoose = require('mongoose');

const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
} = http2.constants;

module.exports = (err, req, res, next) => {
  if (err instanceof mongoose.Error.CastError) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id пользователя.' });
  } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
    res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден.' });
  } else if (err instanceof mongoose.Error.ValidationError) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Были переданы некорректные данные: ${err.message}` });
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    res.status(HTTP_STATUS_CONFLICT).send({ message: 'Такой email уже зарегистрирован.' });
  } else {
    res.status(err.statusCode || HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
  next();
};
