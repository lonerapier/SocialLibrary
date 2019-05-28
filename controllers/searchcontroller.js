var models = require('../models');

exports.getSearch = function(req,res) {
    models.user.aggregate('city', 'DISTINCT', { plain: false})
    .map(function (row) { return row.DISTINCT })
    .then(function (city) {
        // console.log(city);
        res.status(200);
        return res.json(city);
    }).catch(function (err) {
        console.log("uh oh something wasn't right!");
        console.log(err);
        res.status(500).end();
    })
}

exports.postSearch = function(req, res) {
    console.log(req.body);

}