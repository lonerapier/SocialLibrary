var express = require('express');

var authController = require('../controllers/authcontroller');
var addController = require('../controllers/addcontroller');
var listController = require('../controllers/listcontroller');

var router = express.Router();

    router.get('/signup', authController.getSignup);

    router.post('/signup', authController.postSignup);

    router.get('/signin', authController.getSignin);

    router.post('/signin', authController.postSignin);

    router.get('/dashboard',isLoggedIn, authController.dashboard);

    router.get('/logout',authController.logout);

    router.get('/profile',listController.listbooks);

    router.get('/addbooks', function(req, res) {
        res.render('addbooks', {user: req.user});
    });

    /* router.get('/profile', function(req, res) {
        res.render('profile', {user: req.user});
    });*/

    router.get('/update', function(req, res) {
        res.render('update', {user: req.user});
    });

    router.post('/update', authController.updateProfile);

    router.post('/addbooks', addController.addBooks);

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }

module.exports = router;