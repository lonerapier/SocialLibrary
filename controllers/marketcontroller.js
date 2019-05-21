var models = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.listallbooks = function(req,res){
	console.log(req.body);

    models.book.findAll({ include:[{
    	model: models.owned,
    	as : "owned by",
        where : {userId: { [Op.ne]: req.user.id}}
    }] 
     }).then(books => {
   
  
      console.log(books);
      res.render('market',{
      user: req.user,
      book: books
      });  

    })
	
}