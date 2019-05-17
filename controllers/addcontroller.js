var models = require('../models');

exports.addBooks = function(req,res){
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