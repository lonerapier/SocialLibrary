var models = require('../models');

exports.listbooks = function(req,res){
	console.log(req.body);

    models.owned.findAll({ where : {userId: req.user.id} }).then(books => {
   
  
      console.log(books);
      res.render('profile',{
      user: req.user,
      book: books
      });  

    })
	
}



