var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var async = require('async');

exports.request =function(req,res){
    var data = {
        bookId: req.params.id,
        borrowerId: req.user.id
    };
    console.log(data);
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

exports.sentrequest = function(req,res){
    var id = req.body.id;
    var status = req.body.status;
    console.log("Get Sent Requests " + id + " " +status);
    
    models.request.findAll({
        where:{
            borrowerId: id,
            status: status,
            bstatus: 'onhold',
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

exports.cancel = function(req,res) {
    async.waterfall([
        function(done) {
            models.request.update({
                status: 'reject'
            },
            {
                where: {
                    id: req.params.id
                }
            }).then(function(result) {
                console.log('JCB hai sahi hai');
                done(null);
            }).catch(function (err) {
                console.log("Oops you messed up!");
                console.log(err);
                request.server.log(['error'], err.stack);
                done(err,null);
            });
        },
        function(done) {
            models.owned.findOne({
                attributes: ['id'],
                include: [{
                    model: models.request,
                    where: {
                        id: req.params.id
                    },
                }],
            }).then(data => {
                console.log(data);
                done(null,data);                
            }).catch(function(err){
                console.log("Messed Up Status");
                console.log(err);
                done(err,null);
            });
        },
        function(data,done) {
            models.owned.update({
                borrowed: false,
            },
            {
                where: {
                    id: data.id
                }
            }).then(function(result) {
                console.log('JCB hai sahi hai');
                res.redirect('/dashboard');
            }).catch(function (err) {
                console.log("Oops you messed up!");
                console.log(err);
                request.server.log(['error'], err.stack);
                done(err,null);
            });
        }
    ],function(err) {
        console.log(err);
        res.redirect('/dashboard');
    });
}

exports.accept = function(req,res){
    async.waterfall([
        function(done) {
            models.owned.findOne({
                attributes: ['borrowed','id'],
                include: [{
                    model: models.request,
                    where: {
                        id: req.params.id
                    },
                }],
            }).then(data => {
                console.log(data);
                done(null,data);                
            }).catch(function(err){
                console.log("Messed Up Status");
                console.log(err);
                done(err,null);
            });
        },
        function(data, done) {
            if( data.borrowed == true ){
                res.redirect('/dashboard');   
            }
            else {
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
                    console.log(result);
                    done(null,data);
                }).catch(function (err) {
                    console.log("Something is wrong Somewhere!");
                    console.log(err);
                    request.server.log(['error'], err.stack);
                    done(err,null);
                });
            }
        },
        function(data, done) {
            models.owned.update({
                borrowed: true,
            },
            {
                where: {
                    id: data.id
                }
            }).then(function(result) {
                console.log('Something is wrong Somewhere.....but not Here!!');
                console.log(result);
                res.redirect('/dashboard');
            }).catch(function (err) {
                console.log("Something is wrong Somewhere!");
                console.log(err);
                request.server.log(['error'], err.stack);
                done(err,null);
            });
        }
    ],function(err) {
        if (err) return next(err);
            res.redirect('/dashboard');
    });
}

exports.receive = function(req,res){
    async.waterfall([
        function(done) {
            models.owned.findOne({
                attributes: ['status','id'],
                include: [{
                    model: models.request,
                    where: {
                        id: req.params.id
                    },
                }],
            }).then(data => {
                console.log(data);
                done(null,data);                
            }).catch(function(err){
                console.log("Messed Up Status");
                console.log(err);
                done(err,null);
            });
        },
        function(data, done) {
            if( data.status == "lend" ){
                models.request.update({
                    bstatus: 'received',
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
                    done(err,null);
                });
            }
            else {
                models.owned.destroy({ 
                    where : {id: data.id}
                }).then(function(result) {
                    console.log('JCB hai sahi hai');
                    done(null);
                }).catch(function (err) {
                    console.log("Oops you messed up!");
                    console.log(err);
                    request.server.log(['error'], err.stack);
                    done(err,null);
                });
            }
        },
        function(done) {
            models.request.update({
                bstatus: 'returned',
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
                done(err,null);
            });
        }
    ],function(err) {
        if (err) return next(err);
            res.redirect('/dashboard');
    });   
}

exports.bbooks =function(req,res){
    var id = req.body.id;
    console.log("Get Borrowed Books " + id);
    
    models.request.findAll({
        where:{
            bstatus: 'received',
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
            bstatus: 'received',
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
    async.waterfall([
        function(done) {
            models.request.update({
                bstatus: 'returned',
            },
            {
                where: {
                    id: req.params.id
                }
            }).then(function(result) {
                console.log('JCB hai sahi hai');
                done(null);
            }).catch(function (err) {
                console.log("Oops you messed up!");
                console.log(err);
                request.server.log(['error'], err.stack);
                done(err,null);
            });
        },
        function(done) {
            models.owned.findOne({
                attributes: ['id'],
                include: [{
                    model: models.request,
                    where: {
                        id: req.params.id
                    },
                }],
            }).then(data => {
                console.log(data);
                done(null,data);                
            }).catch(function(err){
                console.log("Messed Up Status");
                console.log(err);
                done(err,null);
            });
        },
        function(data,done) {
            models.owned.update({
                borrowed: false,
            },
            {
                where: {
                    id: data.id
                }
            }).then(function(result) {
                console.log('JCB hai sahi hai');
                res.redirect('/dashboard');
            }).catch(function (err) {
                console.log("Oops you messed up!");
                console.log(err);
                request.server.log(['error'], err.stack);
                done(err,null);
            });
        }
    ],function(err) {
        console.log(err);
        res.redirect('/dashboard');
    });
}

exports.recrequest = function(req,res){
    var id = req.body.id;
    console.log("Get Received Requests " + id);
    
    models.request.findAll({
        where:{
            [Op.or]: [{status: 'onhold'},{status: 'accept'}],
            bstatus:'onhold'
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