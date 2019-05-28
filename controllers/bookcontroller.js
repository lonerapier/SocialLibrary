var models = require('../models');
var async = require('async');

// exports.getBook = function(req, res, next) {
//     async.waterfall([
//         function(done) {
//             models.book.findOne({
//                 where: { ISBN: req.params.ISBN }
//             }).then(function(book) {
//                     console.log(book);
//                     done(null, book);
//             }).catch(function (err) {
//                 console.log("Book doesn't exist!");
//                 console.log(err);
//             })
//         }, function(book, done) {
//             models.author.findByPk(book.authorId).then(author => {
//                 console.log(author);
//                     console.log(author);
//                     done(null, book, author);
//             }).catch(function (err) {
//                 console.log("Author doesn't exist!");
//                 console.log(err);
//             })
//         }, function(book, author, done) {
//             models.publisher.findByPk(book.publisherId).then(publisher => {
//                 console.log(publisher);
//                     console.log(publisher);
//                     done(null, book, author, publisher);
//             }).catch(function (err) {
//                 console.log("Publisher doesn't exist!");
//                 console.log(err);
//             })
//         }, function(book, author, publisher, done) {
//             models.owned.findAll({ include:[{
//                 model: models.user,
//                 as: ""
//                 }]
//             }).then(users => {
//                 res.render('book', {
//                     book: book,
//                     author: author,
//                     publisher: publisher,
//                     users: users
//                 });
//             })
//         }
//     ], function(err) {
//         if(err) return next(err);
//         res.redirect('/market');
//     });
// }

exports.getBook = function(req,res){
    console.log("Get Data");
    var isbn = req.params.ISBN;
    models.book.findAll({
        where:{
            ISBN: isbn,
        },
        include: [{
            all: true,
            nested: true
        }]
    }).then(books => {
        console.log(books);
        res.status(200);
        // return res.json(books);
        res.render('book', {
            book: books,
        });
    }).catch(error => {
        console.log("The Force is not with you!");
        console.log(error);
        res.status(500).end();
    });
}