const http2 = require('http2');

class NotValidEmail extends Error {
  constructor(message) {
    super(message);
    this.name = NotValidEmail;
    this.statusCode = http2.constants.HTTP_STATUS_UNAUTHORIZED;
    this.message = 'Введите валидный email.';
  }
}

module.exports = NotValidEmail;
