const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.use(bodyParser.json());

router.post('/register', async (req, res, next) => {
    req = req.body;
    req.password = bcrypt.hashSync(req.password);
    await db.Auth.create(req)
    .then(() => {
        res.end('Registration is succesfull');
    })
    .catch(() => {
        registration.status(501).end('Error registration');
    });
});

router.post('/login', async (req, res, next) => {
    req = req.body;
    let manager = await db.Auth.find({
        where: {
            email: req.email
        }
    });   
    if ((manager) && (bcrypt.compareSync(req.password, manager.password))) {
        res.end(jwt.sign({
            id: manager.id,
            email: req.email
        }, "secret", {expiresIn: 300}));
    }
    else res.status(501).end('Error login');
})

module.exports = router;