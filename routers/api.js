const express = require('express');
const router = express.Router();
const fleetsRouter = require('./fleets');
const vehiclesRouter = require('./vehicles');
const motionsRouter = require('./motions');
const authRouter = require('./auth');

router.use('/fleets', fleetsRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/motions', motionsRouter);
router.use('/auth', authRouter);

module.exports = router;