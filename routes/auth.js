const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// User model
const User = require("../models/user");
const Events = require('../models/events');
const Gameboard = require('../models/gameboard');
const Comment = require('../models/comments');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Sing Up
authRoutes.get("/signup", (req, res) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  if (username === "" || password === "" || email === "" || firstName === "" || lastName === "") {
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
        email,
        firstName: firstName,
        lastName: lastName
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

// home page
authRoutes.get('/home', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/home', {user: req.user});
});

// profile
authRoutes.get('/profile/:userID', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const userId = req.params.userID;
  User.findById(userId)
    .then(profile => {
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
  .then(allEvents => res.render('auth/allevents', { allEvents }))
  .catch(err => console.log(err))

});

// route that create events
authRoutes.get('/createvents', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/createvents');
});

// route to get the data from gameboard for the axios
authRoutes.get('/getgames', (req, res) => {
  Gameboard.find().then(response => {
    res.send(response)
  }).catch(err => console.log(err))
});

// route post that save the events
authRoutes.post('/createvents', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const { title, type, description , numberplayers , typegameboard } = req.body;
  const newEvent = new Events ({
    title: title,
    type: type,
    description: description,
    owner : req.user.id,
    numberplayers: numberplayers,
    choosegame: typegameboard
  });

  newEvent.save().then(event => {
    console.log('Success', event)
  })
  .catch(error => {
    console.log('Error', eror)
  });

  res.redirect('/events');
});

// router that enters a specific event
authRoutes.get('/event/:ID', ensureLogin.ensureLoggedIn('/login'), (req, res) => {

  const eventID = req.params.ID;
  const logged = req.user.id;

  Events.findById(eventID).populate('players').populate('owner').populate('choosegame').populate({path: 'comments', populate: { path: 'owner'}})
  .then(event => {

    let allJoined = event.players;
    let validator = true;
    let count = 1;
    
    allJoined.forEach(element => {
      count += 1;
      if(element.id.toString() === logged.toString()){
        validator = false;
      };
    });

    if(count === event.players.length || event.owner.id.toString() === logged.toString()){
      validator = false;
    }

    if(!validator){
      res.render('auth/event', { event, logged , count});
    } else {
      res.render('auth/event', { event, logged, validator, count});
    }

  })
  .catch(err => console.log(err))
  
});

// router that a user, joins the event. Sorry for the logic, its magic!!!!
authRoutes.get('/join/:idevent/:ID', ensureLogin.ensureLoggedIn('/login'), (req, res) => {

  const eventID = req.params.idevent;
  const player = req.params.ID;

  Events.findById(eventID).then(response => {

    let allJoined = response.players;
    let validator = false;

    allJoined.forEach(element => {
      if(element.toString() === player.toString()){
        validator = true;
      };
    });

    if(response.owner.toString() === player.toString() || validator === true){
      res.redirect(`/event/${eventID}`)
    } else {
      User.findById(player).then(answer => {
      
      Events.update({_id: eventID}, {$push: { players:  answer }})
      .then(success => console.log(success))
      .catch(err => console.log(err))

      }).catch(err => console.log(err));
      res.redirect(`/event/${eventID}`)
    }

  });

});

// router that add comments in events
authRoutes.post('/addcomment', ensureLogin.ensureLoggedIn('/login'), (req, res) => {

  const { comment , eventID } = req.body ;
  const userLogged = req.user.id;
  const newComment = new Comment({
    owner: userLogged,
    description: comment
  });

  newComment.save().then(comment => {
    
    Events.update({_id: eventID}, {$push: {comments: comment.id}})
    .then(success => console.log(success))
    .catch(err => console.log(err));

    console.log('Success', comment);
  })
  .catch(error => {
    console.log('Error', error);
  });

  res.redirect(`/event/${eventID}`);

});

authRoutes.get('/findfriends', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/people', {user: req.user, GMAPS: process.env.GMAPS});
});

module.exports = authRoutes;
