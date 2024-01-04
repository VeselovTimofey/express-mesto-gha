const http2 = require('http2');

class SomeoneElseCard extends Error {
  constructor(message) {
    super(message);
    this.name = SomeoneElseCard;
    this.statusCode = http2.constants.HTTP_STATUS_FORBIDDEN;
    this.message = 'Нельзя удалять чужую карточку.';
  }
}

module.exports = SomeoneElseCard;
