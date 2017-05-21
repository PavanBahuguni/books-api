var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Book = require('./models/bookModel')

var app = express();
var db;
if (process.env.ENV === 'Test') {
    db = mongoose.connect('mongodb://localhost/bookAPI_test');
} else {
    db = mongoose.connect('mongodb://localhost/bookAPI');
}
app.use(bodyParser.urlencoded({}));
app.use(bodyParser.json());

bookRouter = require('./Routes/bookRoutes')(Book);
app.use('/api/books', bookRouter);

app.get('/', function (req, res) {
    res.send("Welcome to my API!");
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Running on port:", port);
});

module.exports = app;