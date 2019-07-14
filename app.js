require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

//routes 
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/private');

//models
const User = require('./models/user');

mongoose.connect(process.env.MONGOD_URI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connect to mongoDB');
});

app.use(morgan('dev'));

app.set('view engine', 'hbs');
app.set('views', `${__dirname  }/views`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

// express session config
app.use(session({
    secret: 'soletsnotflipthetableplease',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // 1 day
      })
}));
  

// user serialization
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});
  
passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
  
  
passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(null, false, { message: 'Incorrect username' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: 'Incorrect password' });
        }

        return next(null, user);
    });
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRoutes);
// app.use('/private', authRoutes);

app.listen(process.env.PORT, () => console.log('server is running on port 3000'));