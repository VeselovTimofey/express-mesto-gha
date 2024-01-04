/* eslint-disable func-names */
const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const NotValidEmail = require('../errors/notvalid_email');
const LoginDeny = require('../errors/login_deny');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail()
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;

  try {
    if (!validator.isEmail(email)) {
      Promise.reject(new NotValidEmail());
    }
  } catch (err) {
    next(err);
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
      about,
      avatar,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
          about: user.about,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => next(err));
};

const _userUpdateLogic = (req, res, body, next) => {
  User.findByIdAndUpdate(req.user._id, body, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => next(err));
};

function updateUserDecorator(func) {
  return function (req, res, next) {
    const { name, about } = req.body;
    func(req, res, { name, about }, next);
  };
}

function updateAvatarDecorator(func) {
  return function (req, res, next) {
    const { avatar } = req.body;
    func(req, res, { avatar }, next);
  };
}

const updateUser = updateUserDecorator(_userUpdateLogic);
const updateAvatar = updateAvatarDecorator(_userUpdateLogic);

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((token) => {
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ email: req.body.email });
    })
    .catch((err) => next(new LoginDeny(err)));
};

const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).orFail()
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getMe,
};
