var express = require('express');
var passport = require("passport")
var qr = require('qr-image'); 
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
  // console.log(req.user._id);
  var userId = req.user._id.toString();
  Child.find({ user: userId }, 'fname lname url', function(err, child) {
  if (err) console.log(err);

  console.log(child);

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
    var childUrl = Child.generateURL(fname, lname);

    var newChild = Child({
        user: user,
        fname: fname,
        lname: lname,
        url: childUrl
    });
    console.log(newChild);
    // Save the user
    newChild.save(function(err, child) {
        if (err) console.log(err);

        res.redirect('/children');
    });
});

/* create a checkin */
router.get('/test/:hash/checkin', function(req, res, next){
  Child.find({ url: req.params.hash }, 'fname lname url', function(err, child) {
    console.log(child);
    res.render('checkin', {
      name: child[0].fname
    });

  });
})

/*test route */
router.get('/test/:hash', authenticatedUser, function(req, res) { 
  Child.find({ url: req.params.hash }, 'fname lname url', function(err, child) {
 
    console.log(child[0].url);
    var urlA = "http://localhost:3000/test/"
    var myUrl = urlA.concat(child[0].url) + "/checkin";
    console.log(myUrl);
    var code = qr.image(myUrl, { type: 'svg' });
    res.type('svg');
    code.pipe(res);
  });
});

module.exports = router;
