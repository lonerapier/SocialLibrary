var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.postSearch = function(req, res) {
    console.log(req.body.fields);
    if(req.body.fields[1] == "north") {
         console.log('yahooooo');
        if(req.body.fields[0] == "Author") {
            models.book.findAll({
                include: [{
                    model: models.author,
                    where: { name: {[Op.like]: '%'+req.body.query+'%'} }
                }, {
                    model: models.publisher
                }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'north'}
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
        else if(req.body.fields[0] == "Publisher") {
            models.book.findAll({
                include: [{
                    model: models.publisher,
                    where: { name: {[Op.like]: '%'+req.body.query+'%'} }
                }, {
                    model: models.author
                }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'north'}
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
        else if(req.body.fields[0] == "Title"){
            models.book.findAll({
                include: [
                { model: models.author },
                { model: models.publisher }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'north'}
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
        else if(req.body.fields[0] == "ISBN"){
            models.book.findAll({
                include: [
                { model: models.author },
                { model: models.publisher }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'north'}
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
        else if(req.body.fields[0] == "Genre"){
            models.book.findAll({
                include: [
                { model: models.author },
                { model: models.publisher }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'north'}
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
    else if(req.body.fields[1] == "south") {

        if(req.body.fields[0] == "Author") {
            models.book.findAll({
                include: [{
                    model: models.author,
                    where: { name: {[Op.like]: '%'+req.body.query+'%'} }
                }, {
                    model: models.publisher
                }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'south'}
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
        else if(req.body.fields[0] == "Publisher") {
            models.book.findAll({
                include: [{
                    model: models.publisher,
                    where: { name: {[Op.like]: '%'+req.body.query+'%'} }
                }, {
                    model: models.author
                }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'south'}
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
        else if(req.body.fields[0] == "Title"){
            models.book.findAll({
                include: [
                { model: models.author },
                { model: models.publisher }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'south'}
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
        else if(req.body.fields[0] == "ISBN"){
            models.book.findAll({
                include: [
                { model: models.author },
                { model: models.publisher }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'south'}
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
        else if(req.body.fields[0] == "Genre"){
            models.book.findAll({
                include: [
                { model: models.author },
                { model: models.publisher }, {
                    model: models.owned,
                    as : "owned by",
                    where : {bookId: { [Op.ne]: "NULL" }, location: 'south'}
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
    else if(req.body.fields == "Author") {
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
    else if(req.body.fields == "north"){
        models.book.findAll({
            include: [
            { model: models.author },
            { model: models.publisher }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }, location: 'north'}
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
    else if(req.body.fields == "south"){
        models.book.findAll({
            include: [
            { model: models.author },
            { model: models.publisher }, {
                model: models.owned,
                as : "owned by",
                where : {bookId: { [Op.ne]: "NULL" }, location: 'south'}
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



   
}