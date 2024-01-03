/* eslint-disable func-names */
const http2 = require('http2');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
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
  const {
    name, email, password, about, avatar,
  } = req.body;

  if (!validator.isEmail(email)) {
    Promise.reject(new Error('Введите валидный email.'));
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Были переданы некорректные данные: ${err.message}` });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

const _userUpdateLogic = (req, res, body) => {
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

function updateUserDecorator(func) {
  return function (req, res) {
    const { name, about } = req.body;
    func(req, res, { name, about });
  };
}

function updateAvatarDecorator(func) {
  return function (req, res) {
    const { avatar } = req.body;
    func(req, res, { avatar });
  };
}

const updateUser = updateUserDecorator(_userUpdateLogic);
const updateAvatar = updateAvatarDecorator(_userUpdateLogic);

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((token) => {
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .end();
    })
    .catch((err) => {
      res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: err.message });
    });
};

const getMe = (req, res) => {
  const { _id } = req.user;
  User.findById(_id).orFail()
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getMe,
};
