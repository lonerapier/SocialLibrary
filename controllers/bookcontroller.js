var models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getBook = function(req, res) {
    if(req.user) {
    models.book.findAll({ include:[{
    	model: models.author,
    }, {
        model: models.publisher,
    }, {
        model: models.owned,
        as: "owned by",
        where: { userId: { [Op.ne]: req.user.id } },
        include: [{
            model: models.user,
        }]
    }],
    where: { ISBN: req.params.ISBN }
     }).then(books => {
        // var mybook = JSON.stringify(books);
        // console.log(mybook);
      res.render('book',{
      user: req.user,
      book: books
      });
    }) }
    else {
    models.book.findAll({ include:[{
    	model: models.author,
    }, {
        model: models.publisher,
    }, {
        model: models.owned,
        as: "owned by",
        where: { bookId: { [Op.ne]: "NULL" } },
        include: [{
            model: models.user,
        }]
    }],
    where: { ISBN: req.params.ISBN }
     }).then(books => {
    //   var mybook = JSON.stringify(books);
    //   console.log(mybook);
      res.render('book',{
      user: req.user,
      book: books
      });

    }) }
}