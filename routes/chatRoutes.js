var express = require('express');
var router = express.Router();

const chatController = require('../controllers/chatController');

/* GET users listing. */
router.post('/', chatController.createRoom); //Temporal route for testing

module.exports = router;
