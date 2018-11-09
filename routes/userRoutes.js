'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authorise = require('../middlewares/authorise');
const admin = require('../middlewares/admin');
// const needer = require('../middlewares/needer');
// const volunteer = require('../middlewares/volunteer');
const { body } = require('express-validator/check');

//public
router.post('/register',  [
    body('name').isLength({ min: 2, max: 40}),
    body('surname').isLength({ min: 2, max: 40}),
    body('password').isLength({ min:8, max:32}).isAlphanumeric(),
    body('dni').isAlphanumeric(),
    body('phone').isNumeric(),
    body('address').matches(/[A-Z ]/i), //No funciona el Regex
    body('email').isEmail().normalizeEmail(),
    body('age').isNumeric().isLength({ min: 2, max: 3}),
    body('gender').isAlpha()], userController.signUp); //ok
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min:8, max:32}).isAlphanumeric()], userController.login); //
router.get('/reset-password', userController.restorePassword);
router.post('/reset-password', [
    body('password').isLength({ min:8, max:32}).isAlphanumeric()], userController.resetPasswordPost);

// private
router.get('/', authorise, userController.getUserData);
router.patch('/', authorise, userController.updateUserData);
router.get('/renew', authorise, userController.renew);


// router.get('/', authorise, userController.getUserData)
/*
router.patch('/', authourise, userController.updateUserData)
*/

// admin
router.get('/list', authorise, userController.getUserList);
router.get('/:id([A-Fa-f0-9]{24})', authorise, admin, userController.getUser);
router.delete('/:id([A-Fa-f0-9]{24})', authorise, admin, userController.deleteUser);
router.patch('/verify/:id([A-Fa-f0-9]{24})', authorise, admin, userController.setUserStatus);

/*
router.get('/list', authorise, admin, userController.getUserList)
router.get('/id/:id', authorise, admin, userController.getUser)
router.delete('/id/id:/delete', authorise, admin, userController.deleteUser)
router.patch('/verify/:id/', authorise, admin, userController.setUserStatus)
*/

module.exports = router;
