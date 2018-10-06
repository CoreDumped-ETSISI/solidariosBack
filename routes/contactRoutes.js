'use strict';

const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');

router.get('/', contactController.getContactInfo);


module.exports = router;
