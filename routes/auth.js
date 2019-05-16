var express = require('express');
var authController = require('../controllers/authcontroller');
var router = express.Router();

    router.get('/signup', authController.getSignup);

    router.post('/signup', authController.postSignup);

    router.get('/signin', authController.getSignin);

    router.post('/signin', authController.postSignin);

    router.get('/dashboard',isLoggedIn, authController.dashboard);

    router.get('/logout',authController.logout);

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }

module.exports = router;