'use strict'

const express = require('express');
const router = express.Router();

const eTypeController = require('../controllers/eTypeController');

router.post('/create', authorise, admin, eTypeController.createType);
router.get('/list', authorise, admin, eTypeController.getEtypes);

module.exports = router;