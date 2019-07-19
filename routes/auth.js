const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const uploadCloud = require("../public/js/cloudinary");
const nodemailer = require("nodemailer");

// User model
const User = require("../models/user");
const Events = require("../models/events");
const Gameboard = require("../models/gameboard");
const Comment = require("../models/comments");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dgentil1996@gmail.com",
    pass: "grumps1307"
  }
});

// Sing Up
authRoutes.get("/signup", (req, res) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;
  const characters ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const confirmationCode = token;
  if (
    username === "" ||
    password === "" ||
    email === "" ||
    firstName === "" ||
    lastName === ""
  ) {
    res.render("auth/signup", {
      message: "Indicate username, password and email!"
    });
    return;
  }

  User.findOne({ username }).then(user => {
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
      confirmationCode,
      firstName: firstName,
      lastName: lastName
    });

    newUser.save()
      .then(() => { 
        transporter.sendMail({
            from: '"Table Flip! " <table.flip@email.com>',
            to: email,
            subject: `Welcome ${username}!`,
            text: "Welcome text",
            html: `<b>confirmation: <a href="http://localhost:3000/confirm/${confirmationCode}"> Confirm Here</a></b>`
          })
          .then(info => res.redirect("/"))
          .catch(error => console.log(error));
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

// Confirm email
authRoutes.get("/confirm/:confirmNum", (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmNum },
    { status: "Active" }
  )
    .then(user => {
      res.render("auth/login");
    })
    .catch(err => {
      res.render("/", { message: "Something went wrong" });
    });
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
  })
);

// Log Out
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//Sign In with Google
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

authRoutes.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/home"
  })
);

// Home page
authRoutes.get("/home", ensureLogin.ensureLoggedIn("/login"), (req, res) => {
  res.render("auth/home", { user: req.user });
});

// Profile
authRoutes.get("/profile/:userID", ensureLogin.ensureLoggedIn("/login"),
  (req, res) => {
    const userId = req.params.userID;
    User.findById(userId)
      .then(profile => {
        res.render("auth/profile", { profile, user: req.user });
      })
      .catch(err => console.log(err));
  }
);

authRoutes.get("/profile/edit/:profileID", ensureLogin.ensureLoggedIn("/login"), (req, res, next) => {
    User.findById(req.params.profileID)
      .then(profile => {
        const user = req.user;
        res.render("auth/profile-edit", { profile, user });
      })
      .catch(error => {
        console.log(error);
      });
  }
);

authRoutes.post("/profile/edit/:profileID", ensureLogin.ensureLoggedIn("/login"), uploadCloud.single("image"),(req, res, next) => {
    const { firstName, lastName, email, description, address } = req.body;
    const imageUrl = req.file.url;
    User.update(
      { _id: req.params.profileID },
      { $set: { firstName, lastName, email, description, address, imageUrl } }
    )
      .then(profile => {
        res.redirect("/profile/" + req.params.profileID);
      })
      .catch(error => {
        console.log(error);
      });
  }
);

// Events
authRoutes.get("/events", ensureLogin.ensureLoggedIn("/login"), (req, res) => {
  Events.find()
    .then(allEvents =>
      res.render("auth/allevents", { allEvents, user: req.user })
    )
    .catch(err => console.log(err));
});


authRoutes.post('/events', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const { type, typegameboard } = req.body;
  console.log(type);
  if(type === 'boardgame'){
    Events.find({type: type, choosegame: typegameboard})
    .then(allEvents => res.render('auth/allevents', { allEvents, user: req.user }))
    .catch(err => console.log(err));
  } else {
    Events.find({type: type, cardGameName: typegameboard})
    .then(allEvents => res.render('auth/allevents', { allEvents, user: req.user }))
    .catch(err => console.log(err));
  }

});

// route that create events
authRoutes.get('/createvents', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/createvents', {user: req.user});
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

  let newEvent;
  if(type === 'boardgame') {
    newEvent = new Events ({
      title: title,
      type: type,
      description: description,
      owner : req.user.id,
      numberplayers: numberplayers,
      choosegame: typegameboard
    });
  } else {
    newEvent = new Events ({
      title: title,
      type: type,
      description: description,
      owner : req.user.id,
      numberplayers: numberplayers,
      cardGameName: typegameboard
    });
  }
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
  const user = req.user;
  Events.findById(eventID).populate('players').populate('owner').populate('choosegame').populate({path: 'comments', populate: { path: 'owner'}})
  .then(event => {
    let allJoined = event.players;
    let validator = true;
    let count = 1;
    let ownerValidator = false;
    allJoined.forEach(element => {
      count += 1;
      if(element.id.toString() === logged.toString()){
        validator = false;
      };
    });

    if(count === event.players.length){
      validator = false;
    }

    if(event.owner.id.toString() === logged.toString()) {
      validator = false;
      ownerValidator = true;
    }

    res.render('auth/event', { event, logged, validator, count, user, ownerValidator, GMAPS: process.env.GMAPS});

  })
  .catch(err => console.log(err))
  
});

// router that edit a specific event
authRoutes.get('/edit-event/:idEvent', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const user = req.user;
  Events.findById(req.params.idEvent)
  .then(event => res.render('auth/edit-event', {event, user, GMAPS: process.env.GMAPS}))
  .catch(error => console.log(error));
});

authRoutes.post('/edit-event/:idEvent', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const { title, type, description , numberplayers , typegameboard, address, date} = req.body;

  if(type === 'boardgame') {
    const empty = '';
    Events.findByIdAndUpdate(req.params.idEvent, {$set: {title: title, address: address, type: type, date: date, description: description, numberplayers: numberplayers, choosegame: typegameboard, cardGameName: empty}})
    .then(success => console.log('Update done', success))
    .catch(error => console.log('Error:', error));
  } else {
    const empty = null;
    Events.findByIdAndUpdate(req.params.idEvent, {$set: {title: title, address: address, type: type, date: date, description: description, numberplayers: numberplayers, cardGameName: typegameboard, choosegame: empty}})
    .then(success => console.log('Update done', success))
    .catch(error => console.log('Error:', error));
  }

  res.redirect(`/event/${req.params.idEvent}`);
});

// router that delete a specific event
authRoutes.get('/delete-event/:idEvent', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
 
  Events.findOneAndRemove({_id: req.params.idEvent})
  .then(success => console.log('Event Deleted,', success))
  .catch(error => console.log('Error', error));

  res.redirect('/events');
});


// User Joining events
authRoutes.get("/join/:idevent/:ID", ensureLogin.ensureLoggedIn("/login"), (req, res) => {
    const eventID = req.params.idevent;
    const player = req.params.ID;

    Events.findById(eventID).then(response => {
      let allJoined = response.players;
      let validator = false;

      allJoined.forEach(element => {
        if (element.toString() === player.toString()) {
          validator = true;
        }
      });

      if (
        response.owner.toString() === player.toString() ||
        validator === true
      ) {
        res.redirect(`/event/${eventID}`);
      } else {
        User.findById(player)
          .then(answer => {
            Events.update({ _id: eventID }, { $push: { players: answer } })
              .then(success => console.log(success))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
        res.redirect(`/event/${eventID}`);
      }
    });
  }
);


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

// router that open google maps and bring all players nearby
authRoutes.get('/findfriends', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/people', {user: req.user, GMAPS: process.env.GMAPS});
});

authRoutes.post('/sendemail', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const message = req.body;
  const user = req.user;
    transporter.sendMail({
        from: '"Table Flip!" <table.flip@email.com>',
        to: message.email,
        subject: `${user.firstName} has sent you a message!`,
        text: "Welcome text",
        html: `${message.message}`
      })
      .then(info => res.redirect("/findfriends"), console.log('foi'))
      .catch(error => console.log(error));
})

authRoutes.get('/places', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/places-map', {user: req.user, GMAPS: process.env.GMAPS});
});

authRoutes.get('/get-address', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  User.find().then(response => {
    res.send(response);
  });

});


module.exports = authRoutes;
