var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.postSearch = function(req, res) {
    if(req.body.fields == "Author") {
        models.book.findAll({
            include: [{
                model: models.author,
                where: { name: {[Op.like]: '%'+req.body.query+'%'} }
            }, {
                model: models.publisher
            }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }}
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
                where: { name: {[Op.like]: '%'+req.body.query+'%'} }
            }, {
                model: models.author
            }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }}
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
            { model: models.publisher }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }}
            }],
            where: { title: {[Op.like]: '%'+req.body.query+'%'} }
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
            { model: models.publisher }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }}
            }],
            where: { ISBN: {[Op.like]: '%'+req.body.query+'%'} }
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
            { model: models.publisher }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }}
            }],
            where: { genre: {[Op.like]: '%'+req.body.query+'%'} }
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