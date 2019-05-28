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

exports.sentrequest = function(req,res){
    var id = req.body.id;
    var status = req.body.status;
    console.log("Get Sent Requests " + id + " " +status);
    
    models.request.findAll({
        where:{
            borrowerId: id,
            status: status,
            return: 'nothing',
        },
        order:[
            ['createdAt', 'DESC'],
        ],
        include: [{
            all: true,
            nested:true
        }]
    }).then(requests =>{
        console.log(requests);
        res.status(200);
        return res.json(requests);
    }).catch(error => {
        console.log("Something's Messed Up!");
        console.log(error);
        res.status(500).end();
    });
}

exports.receive = function(req,res){
    models.request.update({
        return: 'received',
        returndate: Date.now()+1.21e+9
    },
    {
        where: {
            id: req.params.id
        }
    }).then(function(result) {
        console.log('JCB hai sahi hai');
        res.redirect('/dashboard');
    }).catch(function (err) {
        console.log("Oops you messed up!");
        console.log(err);
        request.server.log(['error'], err.stack);
    });
}

exports.recrequest = function(req,res){
    var id = req.body.id;
    console.log("Get Received Requests " + id);
    
    models.request.findAll({
        where:{
            status: 'onhold',
        },
        order:[
            ['createdAt', 'DESC'],
        ],
        include: [{
            model: models.owned,
            where: {
                userId: id
            },
            nested:true,
            include: [{
                model: models.book
            }]
        },
        {
            model: models.user
        }]
    }).then(requests =>{
        console.log(requests);
        res.status(200);
        return res.json(requests);
    }).catch(error => {
        console.log("Something's Messed Up!");
        console.log(error);
        res.status(500).end();
    });
}

exports.accept = function(req,res){
    models.request.update({
        status: 'accept',
        accepted: Date.now()
    },
    {
        where: {
            id: req.params.id
        }
    }).then(function(result) {
        console.log('Something is wrong Somewhere.....but not Here!!');
        res.redirect('/dashboard');
    }).catch(function (err) {
        console.log("Something is wrong Somewhere!");
        console.log(err);
        request.server.log(['error'], err.stack);
    });
}

exports.reject = function(req,res){
    models.request.update({
        status: 'reject'
    },
    {
        where: {
            id: req.params.id
        }
    }).then(function(result) {
        console.log('You just got dumped man!');
        res.redirect('/dashboard');
    }).catch(function (err) {
        console.log("Oops you messed up!");
        console.log(err);
        request.server.log(['error'], err.stack);
    });
}

exports.request =function(req,res){
    var data = {
        bookId: req.params.id,
        borrowerId: req.user.id
    };
    models.request.build(data)
                .save()
                .then(anotherTask => {
                    console.log('the data saved!');
                    res.redirect('/market');
                })
                .catch(error => {
                    console.log("uh oh something wasn't right!");
                    console.log(error);
                })
}

exports.bbooks =function(req,res){
    var id = req.body.id;
    console.log("Get Borrowed Books " + id);
    
    models.request.findAll({
        where:{
            return: 'received',
            borrowerId: id,
        },
        order:[
            ['returndate', 'DESC'],
        ],
        include: [{
            model: models.owned,
            nested:true,
            include: [{
                model: models.book
            },{
                model: models.user
            }]
        }]
    }).then(requests =>{
        console.log(requests);
        res.status(200);
        return res.json(requests);
    }).catch(error => {
        console.log("Something's Messed Up!");
        console.log(error);
        res.status(500).end();
    });
}

exports.lbooks =function(req,res){
    var id = req.body.id;
    console.log("Get Lent Books " + id);
    
    models.request.findAll({
        where:{
            return: 'received',
        },
        order:[
            ['createdAt', 'DESC'],
        ],
        include: [{
            model: models.owned,
            where: {
                userId: id
            },
            nested:true,
            include: [{
                model: models.book
            }]
        },
        {
            model: models.user
        }]
    }).then(requests =>{
        console.log(requests);
        res.status(200);
        return res.json(requests);
    }).catch(error => {
        console.log("Something's Messed Up!");
        console.log(error);
        res.status(500).end();
    });
}

exports.return = function(req,res){
    models.request.update({
        return: 'returned',
    },
    {
        where: {
            id: req.params.id
        }
    }).then(function(result) {
        console.log('JCB hai sahi hai');
        res.redirect('/dashboard');
    }).catch(function (err) {
        console.log("Oops you messed up!");
        console.log(err);
        request.server.log(['error'], err.stack);
    });
}