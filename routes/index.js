const express = require('express');
const router = express.Router();

//models
const User = require('../models/user');
const Events = require('../models/events');

router.get('/', (req, res) => {
    res.render('index');
  });
  
module.exports = router;
