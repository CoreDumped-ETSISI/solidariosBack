'use strict';

const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const authorise = require('../middlewares/authorise');
const admin = require('../middlewares/admin');

router.get('/', eventsController.getEvents);
router.get('/:idEvent([A-Fa-f0-9]{24})', eventsController.getEvent);
router.post('/', authorise, admin, eventsController.createEvent);
router.delete('/:idEvent([A-Fa-f0-9]{24})', authorise, admin, eventsController.deleteEvent);


module.exports = router;
