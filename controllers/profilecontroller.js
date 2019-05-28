var models = require('../models');

exports.listbooks = function(req,res){
	console.log(req.body);

    models.book.findAll({ include:[{
    	model: models.owned,
    	as : "owned by",
        where : {userId: req.user.id}
    }]
     }).then(books => {


    //   console.log(books);
      res.render('profile',{
      user: req.user,
      book: books
      });

    })

}

exports.removebook = function(req, res){


    models.owned.destroy({ where : {id: req.params.id}}).then(() => {

       res.redirect('/profile');
    })

}

exports.editbook = function(req, res) {
    console.log(req.body);
    var data = {
        id:      req.body.id,
        price:  req.body.price,
        status:   req.body.status,
    
      };
      models.owned.update({
        id:      req.body.id,
        price:  req.body.price,
        status:   req.body.status,
      },
        {where: {id:req.body.id}})
        .then(function (result) {
            console.log('the data saved!');
            res.redirect('/profile');
        })
        .catch(function (err) {
            console.log("uh oh something wasn't right!");
            console.log(err);
            request.server.log(['error'], err.stack);
    })

      
    
};



