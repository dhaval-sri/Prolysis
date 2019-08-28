var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3002;
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
var app = express();
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    //The code in this asynchronous callback block is executed after connecting to MongoDB. 
    console.log('Successfully connected to MongoDB.');
});


