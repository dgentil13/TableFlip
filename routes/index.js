const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");

//models
const User = require("../models/user");

router.get("/", (req, res) => {
    res.render("index");
  });
  
router.get("/home", ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  res.render("home");
});

module.exports = router;
