var passport = require('passport');
var models = require('../models');

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
    res.render('signin', {
        message: req.flash('loginMessage')[0],
    });
};

exports.postSignin = function(req, res) {
    passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
    })(req,res);
};

exports.updateProfile = function(req, res) {
    console.log(req.user.id);
    var data = {
        email:      req.body.email,
        firstname:  req.body.firstname,
        lastname:   req.body.lastname,
        phone:      req.body.phone,
        city:       req.body.city,
      };
    // models.user.update(data,
    //     {where: {id: req.body.id}})
    //     .then(function (result) {
    //         models.user.findByPk(req.body.id)
    //         .then(function(user){
    //             response(user).code(200);
    //         }).catch(function (err) {
    //             request.server.log(['error'], err.stack);
    //                 ).code(200);
    //             });
    //         }).catch(function (err) {
    //         request.server.log(['error'], err.stack);
    //     ).code(200);
    // });

    models.user.update({
        email:req.body.email,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        phone:req.body.phone,
        city:req.body.city,
      },
        {where: {id:req.user.id}})
        .then(function (result) {
            console.log('the data saved!');
            res.redirect('/dashboard');
        })
        .catch(function (err) {
            console.log("uh oh something wasn't right!");
            console.log(err);
            request.server.log(['error'], err.stack);
    })
    // res.render('dashboard',{
    //     user:req.user
    // });
};

exports.dashboard = function(req, res) {
    res.render('dashboard');
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/signin');
    });
};