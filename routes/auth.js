var express = require('express');
var passport = require('passport');

var authController = require('../controllers/authcontroller');
var addController = require('../controllers/addcontroller');
var profileController = require('../controllers/profilecontroller');
var marketController = require('../controllers/marketcontroller');
var searchController = require('../controllers/searchcontroller');
var bookController = require('../controllers/bookcontroller');

var router = express.Router();

    router.get('/signup', authController.getSignup);

    router.post('/signup',
    passport.authenticate('local-signup', {
        failureRedirect: '/signup',
        failureFlash: true}),
    function(req, res) {
        res.render('dashboard', {user: req.user});
    });
    // router.post('/signup', authController.postSignup);

    router.get('/signin', authController.getSignin);

    router.post('/signin',
    passport.authenticate('local-signin', {
        failureRedirect: '/signin',
        failureFlash: true}),
    function(req, res) {
        res.render('dashboard', {user: req.user});
    });
    // router.post('/signin', authController.postSignin);

    router.get('/dashboard',isLoggedIn, authController.dashboard);

    router.get('/logout',authController.logout);

    router.get('/profile',profileController.listbooks);

    router.get('/profile/:id',profileController.removebook);

    router.get('/market',marketController.listallbooks);

    router.get('/addbooks', function(req, res) {
        res.render('addbooks', {user: req.user});
    });

    //router.get('/profile', function(req, res) {
      //  res.render('profile', {user: req.user});
    //});

    router.get('/update', function(req, res) {
        res.render('update', {user: req.user});
    });

    router.post('/update', authController.updateProfile);

    router.post('/addbooks', addController.addBooks);

    router.post('/lookupISBN',addController.lookup);

    router.post('/lookupdata',addController.getData);

    router.get('/forgot', authController.getForgot);

    router.post('/forgot', authController.postForgot);

    router.get('/reset/:token', authController.getReset);

    router.post('/reset/:token', authController.postReset);

    router.get('/search', searchController.getSearch);

    router.post('/search', searchController.postSearch);

    router.get('/book/:ISBN', bookController.getBook);

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }

module.exports = router;
