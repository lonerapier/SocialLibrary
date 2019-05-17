var models = require('../models');

exports.listbooks = function(req,res){
	console.log(req.body);

    models.book.findAll({ include:[{
    	model: models.owned,
    	as : "owned by",
        where : {userId: req.user.id}
    }] 
     }).then(books => {
   
  
      console.log(books);
      res.render('profile',{
      user: req.user,
      book: books
      });  

    })
	
}



