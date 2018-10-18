const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./db');
const geolib = require('geolib');

router.use(bodyParser.json());

router.get('/readall', (req, resp, next) => {
    if (req.manager.super) db.Vehicle.findAll().then((res) => {
        resp.json(res);
    });
	else db.Vehicle.findAll({
		where: {
            fleetId: req.manager.fleetId,
            deletedAt: null
        }
    }).then((res) => {
    	if (!res) {
            resp.statusCode = 404;
            next();
        }
        else resp.json(res);
    }); 
});

router.get('/read', (req, resp, next) => {
	if (!req.query.id) resp.json({'error': '\"id\" arg not found'});
	else if (req.manager.super) db.Vehicle.findById(req.query.id).then((res) => {
        if ((!res) || (res.deletedAt !== null)) {
            resp.statusCode = 404;
            next();
        }
        else resp.json(res);
    });
    else db.Vehicle.findAll({
        where: {
            id: id,
            fleetId: req.manager.fleetId,
            deletedAt: null
        },
    }).then((res) => {
        if (!res.length) {
            resp.statusCode = 404;
            next();
        }
        else resp.json(res);
    });
});

router.post('/create', (req, resp, next) => {
    if (!req.manager.super) req.body.fleetId = req.manager.fleetId;
	req = req.body;
	if (!req.name) resp.json({'error': '\"name\" arg not found'});
	else if (!req.fleetId) resp.json({'error': '\"fleetId\" arg not found'});
	else db.Fleet.findById(req.fleetId).then((res) => {
		if ((!res) || (res.deletedAt !== null)) {
            resp.statusCode = 404;
            next();
        }
	    else db.Vehicle.create({'name': req.name, 'fleetId': req.fleetId}).then((res) => {
			resp.json(res);
		});
	});   
});

router.post('/update', (req, resp, next) => {
    if(!req.manager.super) req.body.fleetId = req.manager.fleetId;
	req = req.body;
    if (!req.id) resp.json({'error': '\"id\" arg not found'});
    else if (!req.name) resp.json({'error': '\"name\" arg not found'});
    else if (!req.fleetId) resp.json({'error': '\"fleetId\" arg not found'});
    else db.Vehicle.update(
    	{ name: req.name, fleetId: req.fleetId },
        {
            where: {
                id: req.id,
                deletedAt: null
            }
        }
    ).then((res) => {
		if (res == 0) {
            resp.statusCode = 400;
            next();
        }
        else resp.json({ 'id': req.id, 'name': req.name, 'fleetId': req.fleetId });
    });
});

router.post('/delete', (req, resp, next) => {
    if(!req.manager.super) req.body.fleetId = req.manager.fleetId;
	req = req.body;
    if (!req.id) resp.json({'error': '\"id\" arg not found'});
    else db.Vehicle.findById(req.id).then((res) => {
        if (!res) {
            resp.statusCode = 400;
            next();
        }
        else db.Fleet.destroy({
            where: {
                id: req.id,
                deletedAt: null            
            }
        }).then(() => {
            resp.json(res);
        });
    });
});

router.get('/milage', async (req, resp, next) => {
	if (!req.query.id) resp.json({'error': '\"id\" arg not found'});
	else if(req.manager.super) {
        db.Vehicle.findById(req.query.id).then((res) => {
            if ((!res) || (res.deletedAt !== null)) {
                resp.statusCode = 404;
                next();
            }
            else {
                let coords = [];
                let coordstime = [];
                db.Motion.findAll({
                    where: {
                        vehicleId: req.query.id
                    }
                }).then((res) => {
                    res.forEach((motion) => {
                        coords.push(motion.latLng);
                        coordstime.push(motion.latLngTime);
                    });
                    let len = 0;
                    let spd = 0;
                    if (coords.length < 2) resp.json(len);
                    for (var i = 0; i < coords.length - 1; i++) {
                        len += geolib.getDistance(coords[i], coords[i+1]);
                        spd += geolib.getSpeed(coordstime[i], coordstime[i+1], {unit: 'mph'});
                    }
                    resp.json({
                        'getDistance': len,
                        'getPathLength': (coords.length < 2) ? 0 : geolib.getPathLength(coords),
                        'AVGgetSpeed': Math.round(spd / (coordstime.length - 1))
                    });
                });
            }
        });
    } else {
        let result = await db.Vehicle.findAll({
            where:{
                id: req.query.id,
                fleetId: req.manager.fleetId
            }
        });
        if (result.length > 0) {
            let coords = [];
            let coordstime = [];
            db.Motion.findAll({
                where: {
                    vehicleId: req.query.id
                }
            }).then((res) => {
                res.forEach((motion) => {
                    coords.push(motion.latLng);
                    coordstime.push(motion.latLngTime);
                });
                let len = 0;
                let spd = 0;
                if (coords.length < 2) resp.json(len);
                for (var i = 0; i < coords.length - 1; i++) {
                    len += geolib.getDistance(coords[i], coords[i+1]);
                    spd += geolib.getSpeed(coordstime[i], coordstime[i+1], {unit: 'mph'});
                }
                resp.json({
                    'getDistance': len,
                    'getPathLength': (coords.length < 2) ? 0 : geolib.getPathLength(coords),
                    'AVGgetSpeed': Math.round(spd / (coordstime.length - 1))
                });
            });
        }    
        else {
            resp.statusCode = 404;
            next();
        }
    }


    
});

module.exports = router;