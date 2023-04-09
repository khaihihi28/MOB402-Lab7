const authController = require('../CONTROLLER/authController');
const bookController = require('../CONTROLLER/bookController');
const middlewareController = require('../CONTROLLER/middlewareController');

const router = require('express').Router();

//GET ALL BOOKS
router.get('/', authController.requestRefreshToken, middlewareController.verifyToken, bookController.viewAllBook);
//ADD BOOK
router.get('/add', authController.requestRefreshToken, middlewareController.verifyToken, bookController.viewAddBook);
router.post('/add', authController.requestRefreshToken, middlewareController.verifyToken, bookController.addBook);
//DELETE BOOKS
router.delete('/:id', middlewareController.verifyToken);

module.exports = router;