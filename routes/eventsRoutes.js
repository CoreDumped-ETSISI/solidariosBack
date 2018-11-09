'use strict';

const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const authorise = require('../middlewares/authorise');
const admin = require('../middlewares/admin');

const { body } = require('express-validator/check');

router.get('/', eventsController.getEvents);
router.get('/:idEvent([A-Fa-f0-9]{24})', eventsController.getEvent);
router.post('/', [
    body('name').isLength({ min: 2, max: 100}),
    body('description').not().isLength({ min: 2, max: 4096}),
    body('location').not().isLatLong(),
    body('capacity').not().isNumeric(),
    body('photo').not().isURL()], authorise, admin, eventsController.createEvent);
router.delete('/:idEvent([A-Fa-f0-9]{24})', authorise, admin, eventsController.deleteEvent);


module.exports = router;
