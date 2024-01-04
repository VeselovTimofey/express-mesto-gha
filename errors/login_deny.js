const http2 = require('http2');

class LoginDeny extends Error {
  constructor(error) {
    super(error);
    this.statusCode = http2.constants.HTTP_STATUS_UNAUTHORIZED;
    this.message = error.message;
  }
}

module.exports = LoginDeny;
