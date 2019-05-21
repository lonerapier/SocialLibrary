var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.addBooks = function(req,res){
    console.log("Add Books");
    console.log(req.body);

    var authorid,publisherid,bookid;

    models.author.findOrCreate({where: {name: req.body.author}})
    .then(([user, created]) => {
        console.log(user.get({
            plain: true
        }));
        console.log(created);
        authorid = user.get({plain: true}).id;
        console.log(authorid);

        models.publisher.findOrCreate({where: {name: req.body.publisher}})
        .then(([user, created]) => {
            console.log(user.get({
            plain: true
            }));
            console.log(created);
            publisherid = user.get({plain:true}).id;
            console.log(publisherid);
            var data = {
                title: req.body.title,
                ISBN: req.body.ISBN,
                genre: req.body.genre,
                language: req.body.language,
                authorId: authorid,
                publisherId: publisherid
            };
            console.log(data);
            models.book.findOrCreate({where: {ISBN: req.body.ISBN}, defaults: data})
            .then(([user, created]) => {
                console.log(user.get({
                plain: true
                }));
                console.log(created);
                bookid=user.get({plain:true}).ISBN;
                console.log(bookid);
                var owndata = {
                    price: req.body.price,
                    status: req.body.status,
                    bookId: bookid,
                    userId: req.user.id
                }
                models.owned.build(owndata)
                .save()
                .then(anotherTask => {
                    console.log('the data saved!');
                })
                .catch(error => {
                    console.log("uh oh something wasn't right!");
                    console.log(error);
                })
            })
        })

    })

    res.render('dashboard',{
        user:req.user
    });
}

exports.lookup = function(req,res){
    console.log("Lookup");
    var isbn = req.body.isbn;
    models.book.findAll({ 
        attributes: ['ISBN'],
        where: {
            ISBN: {
                [Op.like]: isbn+'%'
            }},
        limit: 5 
    }).then(books => {
        console.log(books);
        res.status(200);
        return res.json(books);
    }).catch(error => {
        console.log("The Force is not with you!");
        console.log(error);
        res.status(500).end();
    });
}

exports.getData = function(req,res){
    console.log("Get Data");
    var isbn = req.body.isbn;
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
        return res.json(books);
    }).catch(error => {
        console.log("The Force is not with you!");
        console.log(error);
        res.status(500).end();
    });
}