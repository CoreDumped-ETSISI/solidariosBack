'use strict';

const express = require('express');
const router = express.Router();

const vRequestController = require('../controllers/vRequestController');

router.get('/', vRequestController.getvRequests);
router.get('/:idvRequest', vRequestController.getvRequest);
router.post('/', vRequestController.createvRequest);
router.delete('/:idvRequest', vRequestController.deletevRequest);
router.post('/',vRequestController.vRequestSatus);
router.post('/',vRequestController.rateRequest);


module.exports = router;
