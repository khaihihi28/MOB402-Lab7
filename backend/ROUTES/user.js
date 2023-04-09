const middlewareController = require('../CONTROLLER/middlewareController');
const userController = require('../CONTROLLER/userController');

const router = require('express').Router();

//GET ALL USERS
router.get('/', middlewareController.verifyToken, userController.getAllUsers);

//DELETE USERS
router.delete('/:id', middlewareController.verifyTokenIsAdmin, userController.deleteUser);

module.exports = router;