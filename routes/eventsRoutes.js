'use strict';

const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getEvents);
router.get('/:idEvent([A-Fa-f0-9]{24})', eventsController.getEvent);
router.post('/', eventsController.createEvent);
router.delete('/:idEvent([A-Fa-f0-9]{24})', eventsController.deleteEvent);


module.exports = router;
