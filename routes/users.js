const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/me', getMe);
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/w?w?w?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{5,}#?/).required(),
  }),
}), updateAvatar);

module.exports = routerUser;
