var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.postSearch = function(req, res) {
    if(req.body.fields == "Author") {
        models.book.findAll({
            include: [{
                model: models.author,
                where: { name: req.body.query }
            }, {
                model: models.publisher
            }]
        }).then(books => {
            console.log(books);
            // return res.json(books);
            res.render('search',{
                user: req.user,
                book: books
                });
        })
    }
    else if(req.body.fields == "Publisher") {
        models.book.findAll({
            include: [{
                model: models.publisher,
                where: { name: req.body.query }
            }, {
                model: models.author
            }]
        }).then(books => {
            console.log(books);
            // return res.json(books);
            res.render('search',{
                user: req.user,
                book: books
                });
        })
    }
    else if(req.body.fields == "Title"){
        models.book.findAll({
            include: [
            { model: models.author },
            { model: models.publisher }],
            where: { title: req.body.query }
        }).then(books => {
            console.log(books);
            // return res.json(books);
            res.render('search',{
                user: req.user,
                book: books
                });
        })
    }
    else if(req.body.fields == "ISBN"){
        models.book.findAll({
            include: [
            { model: models.author },
            { model: models.publisher }],
            where: { ISBN: req.body.query }
        }).then(books => {
            console.log(books);
            // return res.json(books);
            res.render('search',{
                user: req.user,
                book: books
                });
        })
    }
    else if(req.body.fields == "Genre"){
        models.book.findAll({
            include: [
            { model: models.author },
            { model: models.publisher }],
            where: { genre: req.body.query }
        }).then(books => {
            console.log(books);
            // return res.json(books);
            res.render('search',{
                user: req.user,
                book: books
                });
        })
    }
}