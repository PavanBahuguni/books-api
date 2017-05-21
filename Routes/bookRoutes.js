var express = require('express');

var routes = function (Book) {
    var bookRouter = express.Router();
    var bookController = require('../Controllers/bookController')(Book);

    bookRouter.route('/')
        .post(bookController.post)
        .get(bookController.get);

    bookRouter.use('/:book_id', function (req, res, next) {
        Book.findOne({
            _id: req.params.book_id
        }, function (err, book) {
            if (err) {
                res.status(500, err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send("No book found");
            }
        });
    });

    bookRouter.route('/:book_id')
        .get(function (req, res) {
            var returnBook = req.book.toJSON();
            returnBook.links = {};
            var newLink = 'http://' + req.headers.host + '/api/books?genre=' + returnBook.genre;
            returnBook.links.filterByThisGenre = newLink.replace(' ', '%20');
            res.json(returnBook);
        })
        .put(function (req, res) {
            for (key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    req.book[key] = req.body[key];
                }
            }
            req.book.save(function (err) {
                if (err)
                    res.status(500, err);
                res.json(req.book);
            });
        })
        .patch(function (req, res) {
                for (key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        req.book[key] = req.body[key];
                    }
                }
                req.book.save(function (err) {
                    if (err)
                        res.status(500, err);
                    res.json(req.book);
                });

            }

        )
        .delete(function (req, res) {
            req.book.remove(function (err) {
                if (err) {
                    res.send(500).send(err);
                } else {
                    res.status(402).send("Removed");
                }
            });
        })
    return bookRouter;
}

module.exports = routes;