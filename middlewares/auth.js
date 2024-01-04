const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  try {
    if (!cookie) {
      throw new Unauthorized();
    }
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }

  const token = cookie.replace('jwt=', '');

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }

  req.user = payload;

  next();
};
