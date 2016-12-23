const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const CardPrice = require('../db/db').CardPrice;
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const jsonParser = bodyParser.json();
const options = require('../config/config');

router.get('/', function(req, res, next){
    res.send('123');
});

router.post('/message', function(req, res, next){
    console.log(req);
    res.send('456');
});


module.exports = router;
