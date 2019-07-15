const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Sing Up
authRoutes.get("/signup", (req, res) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res) => {
  const { username, password, email} = req.body;

  if (username === "" || password === "" || email ==="") {
    res.render("auth/signup", { message: "Indicate username, password and email!" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        email
      });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/home"); 
        }
      });
    })
    .catch(error => console.log(error));
});

// Log In

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Log Out
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//Sign In with Google
authRoutes.get("/google", passport.authenticate("google", {
  scope: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read",
          "https://www.googleapis.com/auth/userinfo.email"
        ]
}));

authRoutes.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/home"
}));

// home
authRoutes.get('/home', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/home', {user: req.user});
});

//profile

authRoutes.get('/profile/:userID', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const userId = req.params.userID;
  User.findById(userId)
    .then(profile => {
      console.log(profile);
      res.render('auth/profile', profile );
    })
    .catch(err => console.log(err));
});


authRoutes.get('/profile/edit/:profileID', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  User.findById(req.params.profileID)
    .then((profile) => {
      res.render("auth/profile-edit", profile);
    })
    .catch((error) => {
      console.log(error);
    })
});

authRoutes.post('/profile/edit/:profileID', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  const { firstName, lastName, email, description } = req.body;

  // const imageUrl = req.file.url;

  User.update({ _id: req.params.profileID }, { $set: { firstName, lastName, email, description } })
    .then((profile) => {
      res.redirect('/profile/' + req.params.profileID);
    })
    .catch((error) => {
      console.log(error);
    })
});

// events
authRoutes.get('/events', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  Events.find()
  .then(allEvents => res.render('auth/allevents', allEvents))
  .catch(err => console.log(err))
});

authRoutes.get('/createvents', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/createvents');
});

module.exports = authRoutes;
