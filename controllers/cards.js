const Card = require('../models/card');
const SomeoneElseCard = require('../errors/someone_else_card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail()
    .then((card) => {
      try {
        if (req.user._id !== card.owner._id.valueOf()) {
          Promise.reject(new SomeoneElseCard());
        }
      } catch (err) {
        next(err);
      }
      Card.findByIdAndDelete(req.params.cardId).orFail()
        .then((oldCard) => {
          if (oldCard) {
            res.send({ data: oldCard });
          }
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
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
    .catch((err) => next(err));
};

const dislikeCard = (req, res, next) => {
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
    .catch((err) => next(err));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
