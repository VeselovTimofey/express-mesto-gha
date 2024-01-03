const http2 = require('http2');
const mongoose = require('mongoose');

const {
  HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_BAD_REQUEST,
} = http2.constants;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Были переданы некорректные данные: ${err.message}` });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail()
    .then((card) => {
      if (req.user._id !== card.owner._id.valueOf()) {
        return Promise.reject(new Error('Нельзя удалять чужую карточку.'));
      }
      Card.findByIdAndDelete(req.params.cardId).orFail()
        .then((oldCard) => {
          if (oldCard) {
            res.send({ data: oldCard });
          }
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id карточки.' });
          } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
            res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена.' });
          } else {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
          }
        });
    })
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id карточки.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id карточки.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
