'use strict';

const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');

router.get('/', eventsController.getEvents);
router.get('/:idEvent', eventsController.getEvent);
router.post('/', eventsController.createEvent);
router.delete('/:idEvent', eventsController.deleteEvent);


module.exports = router;
