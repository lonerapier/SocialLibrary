var passport = require('passport');
var models = require('../models');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var bCrypt = require('bcrypt-nodejs');
var exports = module.exports = {}

exports.getSignup = function(req, res) {
    res.render('signup');
};

// exports.postSignup = function(req, res) {
//     passport.authenticate('local-signup', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/signup'
//     })(req,res);
// };

exports.getSignin = function(req, res) {
    res.render('signin', {
        message: req.flash('loginMessage')[0],
    });
};

// exports.postSignin = function(req, res) {
//     passport.authenticate('local-signin', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/signin'
//     })(req,res);
// };

// exports.postSignin = function(req, res) {
//     passport.authenticate('local-signin', {
//         failureRedirect: '/signin',
//         failureFlash: true
//     })
//     console.log('aaaaaaaaaaaaaaaaaaaa');
//     console.log(req.user);
//     res.render('dashboard', {user: req.user});
// };

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
};

exports.dashboard = function(req, res) {
    res.render('dashboard', {user: req.user});
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/signin');
    });
};

exports.getForgot = function(req, res) {
    res.render('forgot', {
        user: req.user,
        flasherror: req.flash('error')[0],
        flashinfo: req.flash('info')[0]
    });
};

exports.postForgot = function(req, res, next) {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
            models.user.findOne({
                where: {email: req.body.email},
            }).then(function(user) {
                if (!user) {
                    req.flash('error', 'Email does not exist');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                done(null, token, user);
            });
        },
        function(token, user, done) {
            // console.log(user);
            models.forgot.findOne({
                where: {userId: user.id},
            }).then(function(newUser) {
                if(!newUser) {
                    models.forgot.build({ userId: user.id, resetPasswordToken: user.resetPasswordToken, resetPasswordExpires: user.resetPasswordExpires })
                    .save()
                    .then(anotherTask => {
                        done(null, token, user);
                    })
                    .catch(error => {
                        console.log("uh oh something wasn't right!")
                        console.log(error);
                    })
                }
                models.forgot.update({
                    resetPasswordToken: user.resetPasswordToken,
                    resetPasswordExpires: user.resetPasswordExpires,
                    userId: user.id
                },
                {where: {id: newUser.id}})
                .then(function (result) {
                    console.log('the data saved!');
                    done(null, token, user);
                })
                .catch(function (err) {
                    console.log("uh oh something wasn't right!");
                    console.log(err);
                    request.server.log(['error'], err.stack);
                })
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'SendGrid',
              auth: {
                user: 'sociallibrary1',
                pass: 'SocialLibrary1'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'passwordreset@demo.com',
              subject: 'Social Library Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions. Please check inbox/spam.');
                    done(err, 'done');
                }
            });
        }
    ], function(err) {
        if (err) return next(err);
            res.redirect('/forgot');
        });
};

exports.getReset = function(req, res) {
    models.forgot.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { [Op.gt]: Date.now() }
        }
    }).then(function(user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      else {
        res.render('reset', {
            user: user
        });
      }
    });
};

exports.postReset = function(req, res, next) {
    async.waterfall([
        function(done) {
            models.forgot.findOne({
                where: {
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: { [Op.gt]: Date.now() }
                }
            }).then(function(user) {
                console.log(user);
            if (!user) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('back');
            }
            else {
                console.log(user);

                models.forgot.update({
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined,
                },
                {where: {id: user.id}})
                .then(function (result) {
                    console.log('the data saved!');
                    done(null, user);
                }).catch(function (err) {
                    console.log("uh oh something wasn't right!");
                    console.log(err);
                    request.server.log(['error'], err.stack);
                })
            }
          });
        },
        function(user, done) {
            console.log(user);
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            models.user.findOne({
                where: { id: user.userId }
            }).then(function(newUser) {
                if(newUser) {
                    var userPassword = generateHash(req.body.password);
                    console.log(userPassword);
                    done(null, user, newUser, userPassword);
                }
                else {
                    req.flash('error', 'Something went wrong with the database. Try again!');
                    return res.redirect('/reset');
                }
            })
        },
        function(user, newUser, userPassword, done) {
            models.user.update({
                password: userPassword
            },
            {where: {id: user.userId}})
            .then(function (result) {
                console.log('the data saved!');
                done(null, newUser);
            }).catch(function (err) {
                console.log("uh oh something wasn't right!");
                console.log(err);
                request.server.log(['error'], err.stack);
            })
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'SendGrid',
              auth: {
                user: 'sociallibrary1',
                pass: 'SocialLibrary1'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'passwordreset@demo.com',
              subject: 'Your password has been changed',
              text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              req.flash('success', 'Success! Your password has been changed.');
              done(err);
            });
          }
    ], function(err) {
        if (err) return next(err);
          res.redirect('/signin');
        });
};
