const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');

router.all('/*', async (req, res, next) => {
    console.log('Auth...');
    let h;
    if (h = req.header('Authorization')) {
        let _h = h.split(' ');
        if (_h[0] !== 'Bearer') res.status(401).send('401: Bearer');
        else if (req.manager === undefined) {
            let token = _h[1];
            console.log(`token = ${token}`);
            jwt.verify(token, 'secret', async (err, dec) => {
                if (!err) { await db.Auth.findById(dec.id).then((itm) => {
                        if (itm !== undefined) req.manager = itm.get({raw: true});
                        else res.status(403).send('403');
                    });
                    next();
                }
                else {
                    resp.statusCode = 403;
                    next();
                }
            });
        } else res.status(401).send('401: Error');
    }
    else res.status(401).send('401: Authorization');
})

module.exports = router;