'use strict'

const express = require ('express')
const router = express.Router()

const eventsController = require ('../controllers/eventsController')

router.get('/s',eventsController.getEvents)
router.get('/getEvent',eventsController.getEvent)
router.post('/createEvent',eventsController.createEvent)
router.delete('/deleteEvent',eventsController.deleteEvent)
router.delete('/deleteAllEvents',eventsController.deleteAllEvents)

module.exports = router