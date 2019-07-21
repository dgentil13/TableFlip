const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// Models
const User = require('../models/user');

// Home page before Log In
router.get('/', ensureLogin.ensureLoggedOut('/home'),(req, res) => {
    res.render('index');
  });
  
module.exports = router;
