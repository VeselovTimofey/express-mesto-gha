const routerCard = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

routerCard.get('/', getCards);
routerCard.post('/', createCard);
routerCard.delete('/:cardId', deleteCard);

module.exports = routerCard;
