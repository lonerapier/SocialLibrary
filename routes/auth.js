var authController = require('../controllers/authcontroller');

module.exports = function(app) {
    app.get('/signup', authController.getSignup);

    app.post('/signup', authController.postSignup);

    app.get('/signin', authController.getSignin);

    app.post('/signin', authController.postSignin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.get('/logout',authController.logout);

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
}