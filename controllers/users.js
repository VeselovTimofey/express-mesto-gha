const http2 = require('http2');
const mongoose = require('mongoose');

const {
  HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_BAD_REQUEST,
} = http2.constants;
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId).orFail()
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id пользователя.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Были переданы некорректные данные: ${err.message}` });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

const _userUpdateLogic = (res, req, body) => {
  User.findByIdAndUpdate(req.user._id, body, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Были переданы некорректные данные: ${err.message}` });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

const updateUser = (req, res) => {
  _userUpdateLogic(res, req, req.body);
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  _userUpdateLogic(res, req, { avatar });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
