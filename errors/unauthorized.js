const http2 = require('http2');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = Unauthorized;
    this.statusCode = http2.constants.HTTP_STATUS_UNAUTHORIZED;
    this.message = 'Необходима авторизация.';
  }
}

module.exports = Unauthorized;
