'use strict';
const path = require('path');

const multer = require('multer');
const upload = multer({
    fileFilter: function (req, file, cb) {

        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    },

    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/avatarImages'))
        }
    })
});

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authorise = require('../middlewares/authorise');
const admin = require('../middlewares/admin');

//public
router.post('/register/', upload.single('avatar'), userController.signUp);
router.post('/login/', userController.login); //
router.get('/reset-PASSWORD/', userController.restorePassword);
router.post('/reset-PASSWORD/', userController.resetPasswordPost);

// private
router.get('/', authorise, userController.getUserData);
router.patch('/', userController.updateUserData);


// router.get('/', authorise, userController.getUserData)
/*
router.patch('/', authourise, userController.updateUserData)
*/

// admin
router.get('/list', userController.getUserList);
router.get('/volunteer', userController.getVolunteerList);
router.get('/:id', userController.getUser);
router.delete('/:id/', userController.deleteUser);
router.patch('/verify/:id/', userController.setUserStatus);

/*
router.get('/list', authorise, admin, userController.getUserList)
router.get('/id/:id', authorise, admin, userController.getUser)
router.delete('/id/id:/delete', authorise, admin, userController.deleteUser)
router.patch('/verify/:id/', authorise, admin, userController.setUserStatus)
*/

module.exports = router;