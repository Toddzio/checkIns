var express = require('express');
var passport = require("passport");
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
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
  });

  return loginStrategy(req, res);
});

/* Render Home */
router.get('/home', authenticatedUser, function(req, res, next){
  var userId = req.user._id.toString();
  Child.find({ user: userId }, 'fname lname url', function(err, child){
      if (err) console.log("snake")
        
    console.log("foo");
    res.render('home', {
      Children: child
    });
  });
});

/* render manage*/
router.get('/manage', authenticatedUser, function(req, res, next){
   var userId = req.user._id.toString();
  Child.find({ user: userId }, 'fname lname url', function(err, child){
      if (err) console.log(err)
        
    console.log("bar");
    res.render('manage', {
      Children: child
    });
  });
});

/*delete route*/
router.delete('/children/:hash/delete', authenticatedUser, function(req, res, next) {
  console.log(req.params.hash);
  Child.findByIdAndRemove(req.params.hash, function(err) {
    if (err) console.log(err);
    console.log('User deleted!');
  });
  res.redirect('/manage')
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect("/");
});

/* view all children */
router.get('/children', authenticatedUser, function(req, res, next){
    var userId = req.user._id.toString();
  Child.find({ user: userId }, 'fname lname url', function(err, child){
      if (err) console.log("snake")
        
    console.log("child");
    res.render('children', {
      Children: child
    });
  });
});


/* create new children */
router.get('/children/new', authenticatedUser, function(req, res, next) {
  // console.log(req.user._id);
  var userId = req.user._id.toString();
  Child.find({ user: userId }, 'fname lname url', function(err, child) {
  if (err) console.log(err);

  // user.name
  // user.email
  // user.favorite 
});
  res.render("childrennew", {
    id: req.user._id,
    fname: req.user.local.fname,
    lname: req.user.local.lname,
    children: req.user.children
  });
});


/* create a child object */

router.post('/childrennew', authenticatedUser, function(req, res, next) {
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

        res.redirect('/home');
    });
});

/* create a checkin */
router.get('/children/:hash/checkin', function(req, res, next){
  Child.find({ url: req.params.hash }, 'fname lname url checkins', function(err, child) {
    console.log(child[0].checkins);
    res.render('checkin', {
      name: child[0].fname,
      hash: child[0].url,
      userId: child[0]._id
    });

  });
})
 
/* update child with checkin */
router.patch('/children/:hash/checkin', function(req, res, next){
  console.log(req.body);
   if (req.body.lat && req.body.long == undefined) {
    req.body.lat = 0
    req.body.long = 0
   };
  req.body.time = new Date()
  Child.update({url: req.params.hash}, { $push: {checkins: req.body }},  function(err, numberAffected, rawResponse) {
     if (err)
  console.log(err);
    res.redirect('checkedin');
  });
});

/* list checkins */
router.get('/children/:hash/review', authenticatedUser, function(req, res, next){
  Child.find({ url: req.params.hash }, 'fname lname url checkins', function(err, child) {
    if(child[0].checkins[0] != undefined && child[0].checkins[0].lat != null){
      res.render('review', {
        fname: child[0].fname,
        lname: child[0].lname,
        hash: child[0].url,
        lat: child[0].checkins[0].lat,
        long: child[0].checkins[0].long,
        checkins: child[0].checkins
      });
    };
    res.redirect('/home');
  });
});

/*QR code generation */
router.get('/children/:hash/qr', authenticatedUser, function(req, res) { 
  Child.find({ url: req.params.hash }, 'fname lname url', function(err, child) {
     var urlA = "https://gacheckins.herokuapp.com/children/"
    var myUrl = urlA.concat(child[0].url) + "/checkin";
    console.log(myUrl);
    var code = qr.image(myUrl, { type: 'svg' });
    res.type('svg');
    code.pipe(res);
  });
});

module.exports = router;
