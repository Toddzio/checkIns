var express = require('express');
var passport = require("passport")
var User = require('../models/user');
var Child = require('../models/child');
var router = express.Router();

function authenticatedUser(req, res, next) {
  // If the user is authenticated, then we can continue with next
  // https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74
  if (req.isAuthenticated()) return next();

  // Otherwise
  req.flash('errorMessage', 'Login to access!');
  return res.redirect('/login');
}

function unAuthenticatedUser(req, res, next) {
  if (!req.isAuthenticated()) return next();

  // Otherwise
  req.flash('errorMessage', 'You are already logged in!');
  return res.redirect('/');
}

/* GET / */
router.get('/', function(req, res, next) {
  res.render('index', { message: req.flash('errorMessage') });
});

/* GET /signup */
router.get('/signup', unAuthenticatedUser, function(req, res, next) {
  res.render('signup', { message: req.flash('errorMessage') });
});

/* POST /signup */
router.post('/signup', function(req, res, next) {
  var signupStrategy = passport.authenticate('local-signup', {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  });

  return signupStrategy(req, res);
});

/* GET /login */
router.get('/login', unAuthenticatedUser, function(req, res, next) {
  res.render('login', { message: req.flash('errorMessage') });
});

/* POST /login */
router.post('/login', function(req, res, next) {
  var loginStrategy = passport.authenticate('local-login', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  });

  return loginStrategy(req, res);
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect("/");
});

/* Restricted pages */
router.get('/secret', authenticatedUser, function(req, res, next) {
  res.render("secret");
});

/* list children */
router.get('/children', authenticatedUser, function(req, res, next) {
  console.log(req.user);
  Child.find({ _id: '5727ab3299767b175b7453a7' }, 'fname lname', function(err, child) {
    console.log(child);
  // if (err) console.log(err);

  // user.name
  // user.email
  // user.favorite 
});
  res.render("children", {
    id: req.user._id,
    fname: req.user.local.fname,
    lname: req.user.local.lname,
    children: req.user.children
  });
});


/* create a child object */

router.post('/children', authenticatedUser, function(req, res, next) {
    var user = req.body.user;
    var fname = req.body.fname;
    var lname = req.body.lname;  

    var newChild = Child({
        user: user,
        fname: fname,
        lname: lname
    });

    // Save the user
    newChild.save(function(err, user) {
        if (err) console.log(err);

        res.send('User created!');
    });
});

/* create a qr code for a child */
router.get('/child/ahash', function(req, res, next ){

})

/* create a checkin */
router.get('/checkin/ahash', function(req, res, next){


})
module.exports = router;
