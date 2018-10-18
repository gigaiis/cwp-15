const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./db');

router.use(bodyParser.json());

router.get('/readall', (req, resp, next) => {
    console.log('/readall');
    if (req.manager.super) db.Fleet.findAll().then((res) => {
        resp.json(res);
    }); 
    else {
        resp.statusCode = 403;
        next();
    }
});

router.get('/read', (req, resp, next) => {
    if(req.manager.super) req.query.id = req.manager.fleetId;  
    if (!req.query.id) resp.json({'error': '\"id\" arg not found'});
    else db.Fleet.findById(req.query.id).then((res) => {
        if ((!res) || (res.deletedAt !== null)) {
            resp.statusCode = 404;
            next();
        }
        else resp.json(res);
    });
});

router.post('/create', (req, resp, next) => {
    if (req.manager.super) {
        req = req.body;
        if (!req.name) resp.json({'error': '\"name\" arg not found'});
        else db.Fleet.create({'name': req.name}).then((res) => {
            resp.json(res);
        });
    } else {
        resp.statusCode = 403;
        next();
    }
});

router.post('/update', (req, resp, next) => {
    if (req.manager.super) {
        req = req.body;
        if (!req.id) resp.json({'error': '\"id\" arg not found'});
        else if (!req.name) resp.json({'error': '\"name\" arg not found'});
        else db.Fleet.update(
            { 'name': req.name },
            {
                where: {
                    id: req.id,
                    deletedAt: null
                }
            }).then((res) => {
                if (res == 0) {
                    resp.statusCode = 400;
                    next();
                }
                else resp.json({ 'id': req.id, 'name': req.name });
        });
    } else {
        resp.statusCode = 403;
        next();
    }
});

router.post('/delete', (req, resp, next) => {
    if (req.manager.super) {
        req = req.body;
        if (!req.id) resp.json({'error': '\"id\" arg not found'});
        else db.Fleet.findById(req.id).then((res) => {
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
    } else {
        resp.statusCode = 403;
        next();
    }
});

module.exports = router;