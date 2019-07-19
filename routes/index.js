const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

//models
const User = require('../models/user');

router.get('/', ensureLogin.ensureLoggedOut('/home'),(req, res) => {
    res.render('index');
  });
  
module.exports = router;
