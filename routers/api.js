const express = require('express');
const router = express.Router();
const fleetsRouter = require('./fleets');
const vehiclesRouter = require('./vehicles');
const motionsRouter = require('./motions');

router.use('/fleets', fleetsRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/motions', motionsRouter);

module.exports = router;