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
        transporter
          .sendMail({
            from: '"Table Flip! " <table.flip@email.com>',
            to: email,
            subject: `Welcome ${username}!`,
            text: "Welcome text",
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TableFlip Confirm Email</title>

  <style type="text/css">
  @import url(http://fonts.googleapis.com/css?family=Droid+Sans);


  img {
    max-width: 600px;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
  }

  a {
    text-decoration: none;
    border: 0;
    outline: none;
    color: #bbbbbb;
  }

  a img {
    border: none;
  }


  td, h1, h2, h3  {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 400;
  }

  td {
    text-align: center;
  }

  body {
    -webkit-font-smoothing:antialiased;
    -webkit-text-size-adjust:none;
    width: 100%;
    height: 100%;
    color: #37302d;
    background: #ffffff;
    font-size: 16px;
  }

   table {
    border-collapse: collapse !important;
  }

  .headline {
    color: #ffffff;
    font-size: 36px;
  }

 .force-full-width {
  width: 100% !important;
 }

 .force-width-80 {
  width: 80% !important;
 }




  </style>

  <style type="text/css" media="screen">
      @media screen {
         /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
        td, h1, h2, h3 {
          font-family: 'Droid Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
        }
      }
  </style>

  <style type="text/css" media="only screen and (max-width: 480px)">
    /* Mobile styles */
    @media only screen and (max-width: 480px) {

      table[class="w320"] {
        width: 320px !important;
      }

      td[class="mobile-block"] {
        width: 100% !important;
        display: block !important;
      }


    }
  </style>
</head>
<body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none" bgcolor="#ffffff">
<table align="center" cellpadding="0" cellspacing="0" class="force-full-width" height="100%" >
  <tr>
    <td align="center" valign="top" bgcolor="#ffffff"  width="100%">
      <center>
        <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="600" class="w320">
          <tr>
            <td align="center" valign="top">

                <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" class="force-full-width" style="margin:0 auto;">
                  <tr>
                    <td style="font-size: 30px; text-align:center;">
                      <br>
                        TableFlip!
                      <br>
                      <br>
                    </td>
                  </tr>
                </table>

                <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" class="force-full-width" bgcolor="#4dbfbf">
                  <tr>
                    <td>
                    <br>
                      <img src="https://www.filepicker.io/api/file/carctJpuT0exMaN8WUYQ" width="224" height="240" alt="robot picture">
                    </td>
                  </tr>
                  <tr>
                    <td class="headline">
                      Good News!
                    </td>
                  </tr>
                  <tr>
                    <td>

                      <center>
                        <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" width="60%">
                          <tr>
                            <td style="color:#187272;">
                            <br>
                             Your account has been created, now you only have to confirm the email to have access to login!
                            <br>
                            <br>
                            </td>
                          </tr>
                        </table>
                      </center>

                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                            <a href="http://localhost:3000/confirm/${confirmationCode}"
                      style="background-color:#178f8f;border-radius:4px;color:#ffffff;display:inline-block;font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;line-height:50px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">Confirm Here</a>
                    </div>
                      <br>
                      <br>
                    </td>
                  </tr>
                </table>

                <table style="margin: 0 auto;" cellpadding="0" cellspacing="0" class="force-full-width" bgcolor="#414141" style="margin: 0 auto">
                  <tr>
                    <td style="background-color:#414141;">
                    <br>
                    <br>
                      <img src="https://www.filepicker.io/api/file/R4VBTe2UQeGdAlM7KDc4" alt="google+">
                      <img src="https://www.filepicker.io/api/file/cvmSPOdlRaWQZnKFnBGt" alt="facebook">
                      <img src="https://www.filepicker.io/api/file/Gvu32apSQDqLMb40pvYe" alt="twitter">
                      <br>
                      <br>
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#bbbbbb; font-size:12px;">
                      <a href="#">View in browser</a> | <a href="#">Unsubscribe</a> | <a href="#">Contact</a>
                      <br><br>
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#bbbbbb; font-size:12px;">
                       © 2019 All Rights Reserved
                       <br>
                       <br>
                    </td>
                  </tr>
                </table>
            </td>
          </tr>
        </table>
    </center>
    </td>
  </tr>
</table>
</body>
</html>`
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

authRoutes.post("/profile/edit/:profileID", ensureLogin.ensureLoggedIn("/login"),
  uploadCloud.single("image"),
  (req, res, next) => {
    const { firstName, lastName, email, description, address } = req.body;
    

    if(req.file){
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
        
    } else {

      User.update(
        { _id: req.params.profileID },
        { $set: { firstName, lastName, email, description, address } }
      )
        .then(profile => {
          res.redirect("/profile/" + req.params.profileID);
        })
        .catch(error => {
          console.log(error);
        });
    }
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
  if(type === 'boardgame' && typegameboard !== 'none'){
    Events.find({type: type, choosegame: typegameboard})
    .then(allEvents => res.render('auth/allevents', { allEvents, user: req.user }))
    .catch(err => console.log(err));
  } else if(type === 'boardgame' && typegameboard === 'none'){
    Events.find({type: type})
    .then(allEvents => res.render('auth/allevents', { allEvents, user: req.user }))
    .catch(err => console.log(err));
  } else if(type === 'cardgame' && typegameboard !== 'none'){
    Events.find({type: type, cardGameName: typegameboard})
    .then(allEvents => res.render('auth/allevents', { allEvents, user: req.user }))
    .catch(err => console.log(err));
  } else if(type === 'cardgame' && typegameboard === 'none'){
    Events.find({type: type})
    .then(allEvents => res.render('auth/allevents', { allEvents, user: req.user }))
    .catch(err => console.log(err));
  } else {
    Events.find({type: type})
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
    let allComement = event.comments;

    let cownerValidator = false;
    let validator = true;
    let ownerValidator = false;
    let count = 1;

    allJoined.forEach(element => {
      count += 1;
      if(element.id.toString() === logged.toString()){
        validator = false;
      };
    });

    allComement.forEach(element => {
      if(element.owner.id.toString() === logged.toString() && event.owner.id.toString() !== logged.toString()){
        element.cownerValidator = true;
      } else {
        element.cownerValidator = false;
      };
    });

    if(count === event.players.length){
      validator = false;
    }

    if(event.owner.id.toString() === logged.toString()) {
      validator = false;
      ownerValidator = true;
      cownerValidator = true;
    }

    res.render('auth/event', { event, logged, validator, count, user, ownerValidator, cownerValidator, GMAPS: process.env.GMAPS});

  })
  .catch(err => console.log(err))
  
});

// router that edit a specific event
authRoutes.get('/edit-event/:idEvent', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  const user = req.user;
  Events.findById(req.params.idEvent)
  .then(event => res.render('auth/edit-event', {event, user}))
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
  })
  .catch(error => {
    console.log('Error', error);
  });

  res.redirect(`/event/${eventID}`);

});

authRoutes.get('/delete-comment/:idEvent/:idComment', ensureLogin.ensureLoggedIn('/login'), (req, res) => {

    Events.findById(req.params.idEvent)
    .then(response =>{
      const runComments = response.comments;
      let newComments = [];
      runComments.forEach(element => {
        if(element.toString() !== req.params.idComment.toString()){
          newComments.push(element);
        };
        console.log(newComments);
      });
      Events.updateOne({_id: req.params.idEvent}, {$set: {comments: newComments}})
      .then(success => console.log(success))
      .catch(error => console.log(error));
    })
    .catch(error => console.log(error))

    Comment.findByIdAndDelete(req.params.idComment)
    .then(success => console.log(success))
    .catch(error => console.log(error));

    res.redirect(`/event/${req.params.idEvent}`);

});
// router that open google maps and bring all players nearby
authRoutes.get('/findfriends', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/people', {user: req.user, GMAPS: process.env.GMAPS});
});

authRoutes.get('/places', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('auth/places-map', {user: req.user, GMAPS: process.env.GMAPS});
});

authRoutes.get('/get-address', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  User.find().then(response => {
    res.send(response);
  });

});


module.exports = authRoutes;
