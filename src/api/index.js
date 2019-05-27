const express = require('express');
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const users = require('./models/user');

const app = express();


passport.use(new Strategy(
  function (username, password, cb) {
    users.authUsername(username, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      console.log('user', user);
      return cb(null, user);
    });
  }
));

passport.serializeUser(function (user, cb) {
  console.log(user);
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
// app.get('/',
//   function (req, res) {
//     res.status(200);
//   });

// app.get('/login',
//   function (req, res) {
//     res.render('login');
//   });

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/woo');
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  });




const port = process.env.PORT || 3000;

// Location of ParcelJS files
app.use(express.static(path.join(__dirname, '../../dist')));

app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`)
});
