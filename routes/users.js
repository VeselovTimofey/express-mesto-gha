const routerUser = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUserById);
routerUser.post('/', createUser);

module.exports = routerUser;
