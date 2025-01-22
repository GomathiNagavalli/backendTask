const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.patch('/change-password', userController.changePassword);
// router.put('/change-password', userController.changePassword);
router.put('/user/:id/designation', userController.updateDesignation);
router.get('/user/:id', userController.getUser);
router.delete('/users/:id', userController.deleteUser);

// const userController = require('../controllers/userController');




module.exports = router;
