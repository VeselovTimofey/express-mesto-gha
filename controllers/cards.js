const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
    });
};

const createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError'){
        res.status(400).send({ message: `Были переданы некорректные данные: ${err.message}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена.' })
      } else {
        res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки.' })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id }},
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена.' })
      } else {
        res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки.' })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена.' })
      } else {
        res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id карточки.' })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}, с текстом ${err.message}.` })
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
