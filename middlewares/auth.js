const http2 = require('http2');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    return res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = cookie.replace('jwt=', '');

  let payload;

  try {
    payload = jwt.verify(token, 'd30bee6b8f85632012147b57c887203f66b3dbbafdca45f32a2db90fa7f65c88');
  } catch (err) {
    return res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
