var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getCity = function(req,res) {
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

exports.postCity = function(req, res) {
    console.log(req.body.id);
    if(req.body.id) {
        models.owned.findAll({
            include: [{
                model: models.user,
                where: { id: { [Op.ne]: req.body.id} }
            }],
            where: { bookId: req.body.ISBN }
        }).then(books => {
            var mybook = JSON.stringify(books);
            console.log(mybook);
            return res.json(books);
        })
    } else {
        models.owned.findAll({
            include: [{
                model: models.user,
            }],
            where: { bookId: req.body.ISBN }
        }).then(books => {
            var mybook = JSON.stringify(books);
            console.log(mybook.user);
            return res.json(books);
        })
    }
}