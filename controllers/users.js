const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден.' })
      } else {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id пользователя.' })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Были переданы некорректные данные: ${err.message}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Были переданы некорректные данные: ${err.message}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Были переданы некорректные данные: ${err.message}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar };
