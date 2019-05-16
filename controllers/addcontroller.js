var models = require('../models');

exports.addBooks = function(req,res){
    console.log(req.body);
    var data ={
                title: req.body.name,
                ISBN: req.body.ISBN,
                userId: req.user.id
              };
    console.log(data);
    // models.book.create(data, {fields: ['title','ISBN','userId']}).then(function(newBook, created) {
    //     if(!newBook){
    //         console.log("Data not written into database.");
    //     }
    //     else{
    //         console.log(newBook.id);
    //     }
    // });
    models.book.build(data)
                .save()
                .then(anotherTask => {
                    console.log('the data saved!');
                })
                .catch(error => {
                    console.log("uh oh something wasn't right!");
                    console.log(error);
                })
    res.render('dashboard',{
        user:req.user
    });
}