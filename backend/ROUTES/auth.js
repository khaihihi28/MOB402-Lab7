const router = require('express').Router();
const authController = require('../CONTROLLER/authController');
const middlewareController = require('../CONTROLLER/middlewareController');

//REGISTER
router.get('/register', authController.viewRegisterUser)
router.post('/register', authController.registerUser)
//LOGIN
router.get('/login', authController.viewLoginUser)
router.post('/login', authController.loginUser);
//REFRESH
router.post('/refresh', authController.requestRefreshToken);
//LOGOUT
router.post('/logout', middlewareController.verifyToken, authController.userLogout);
module.exports = router;