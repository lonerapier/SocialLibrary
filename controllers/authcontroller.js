var passport = require('passport');
var exports = module.exports = {}

exports.getSignup = function(req, res) {
    res.render('signup');
};

exports.postSignup = function(req, res) {
    passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    })(req,res);
};

exports.getSignin = function(req, res) {
    res.render('signin');
};

exports.postSignin = function(req, res) {
    passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
    })(req,res);
};

exports.dashboard = function(req, res) {
    res.render('dashboard');
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};