const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./db');
router.use(bodyParser.json());

router.post('/create', (req, resp, next) => {
    req = req.body;
    if (!req.latitude) resp.json({'error': '\"latitude\" arg not found'});
    else if (!req.longitude) resp.json({'error': '\"longitude\" arg not found'});
    else if (!req.time) resp.json({'error': '\"time\" arg not found'});
    else if (!req.vehicleId) resp.json({'error': '\"vehicleId\" arg not found'});
    else db.Fleet.findById(req.fleetId).then((res) => {
        if ((!res) || (res.deletedAt !== null)) {
            resp.statusCode = 404;
            next();
        }
        else db.Motion.create({latitude: req.latitude, longitude: req.longitude, time: req.time, vehicleId: req.vehicleId}).then((res) => {
            resp.json(motion);
        }); 
    });           
});

module.exports = router;