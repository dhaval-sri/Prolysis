var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3004;
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
var app = express();
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    //The code in this asynchronous callback block is executed after connecting to MongoDB. 
    console.log('Successfully connected to MongoDB.');
});

var User = require("./models/user");
var UserContest=require("./models/user_contest");

app.post("/user/:uID", async function (req, res) {
    try{
        var uID = req.params.uID;
        var uName = req.query.uName;
        var uEmail = req.query.uEmail;
        let document
        try {
            document = await User.create({uID:uID,uName:uName,uEmail:uEmail})
        } catch (err) {
            return res.send("NOT OKAY"+err)
        }
        console.log(document);
        return res.send("OKAY");
    }catch(err){
        console.log(err);
    }
});

app.delete("/user/:uID",async function(req,res){
    try{
        var uID = req.params.uID;
        let data
        try {
            data = await User.deleteOne({uID:uID});
        } catch (err) {
            return res.send("NOT OKAY"+err)
        }
        console.log(data);
        res.send("OKAY");
    }catch(err){
        console.log(err);
    }
});
app.get("/user/:uID",async function(req,res){
    try{
        var uID = req.params.uID;
        let data
        try {
            data = await User.find({uID:uID});
        } catch (err) {
            return res.send("NOT OKAY"+err)
        }
        console.log(data);
        res.send(data);
    }catch(err){
        console.log(err);
    }
});
app.post("/linkUserContest/:uID/:cID",async function(req,res){
    try{
        var uID=req.params.uID;
        var cID=req.params.cID;
        let data;
        data=await UserContest.create({uID:uID,cID:cID});
        return res.send("OKAY"+data);
    }catch(err){
        return res.send("Some Error in the code & inputs"+err);
    }
});
app.listen(port, process.env.IP, function () {
    console.log("Server Started...... ");
});