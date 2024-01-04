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
    payload = jwt.verify(token, 'd30bee6b8f85632012147b57c887203f66b3dbbafdca45f32a2db90fa7f65c88');
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }

  req.user = payload;

  next();
};
