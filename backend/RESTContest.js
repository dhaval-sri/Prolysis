var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
var app = express();
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    //The code in this asynchronous callback block is executed after connecting to MongoDB. 
    console.log('Successfully connected to MongoDB.');
});

var Contest = require("./models/contest");
var UserContest = require("./models/user_contest");
var executionTime = require("./models/executetimetaken");

//Have to make Changes wherein insertion in constest amounts to insert into contestproblem strictly
app.post("/createContest/:cID", async function (req, res) {
    try {
        var cID=req.params.cID;
        var cName = req.query.cName;
        var cDate = req.query.cDate.toString();
        var cTime = req.query.cTime.toString();
        var cDuration = req.query.cDuration;
        var year=cDate.substring(0,4);
        var month=cDate.substring(4,6);
        var day=cDate.substring(6,8);
        var hours=cTime.substring(0,2);
        var minutes=cTime.substring(2,4);
        var date=new Date(year,month,day,hours,minutes,0,0);
        // console.log(cName);
        // console.log(year);
        // console.log(month);
        // console.log(day);
        // console.log(hours);
        // console.log(minutes);
        // // console.log(cDuration); //m new Date(year, month, day, hours, minutes, seconds, milliseconds)
        // console.log(date);
        // console.log(date.getMonth());
        // console.log(date.getMinutes());
        // console.log(date.getDay());
        // console.log(date.getHours());
        let data
        try {
            data = await Contest.create({
                cID: cID,
                cName: cName,
                cDate: date,
                cTime: date,
                cDuration: cDuration
            });
        } catch (err) {
            return res.send("NOT OKAY" + err)
        }
        console.log(data);
        res.send("Okay");
    } catch (err) {
        console.log(err);
        res.send("Something Wrong");
    }
});

app.get("/getContest/:cID",async function(req,res){
    try{
        var cID=req.params.cID;
        try {
            data = await Contest.find({
                cID: cID,            });
        } catch (err) {
            return res.send("NOT OKAY" + err)
        }
        res.send(data);
    }catch(err){
        console.log(err);
        res.send("not okay");
    }
});

app.delete("/deleteContest/:cID",async function(req,res){
    try{
        var cID=req.params.cID;
        let data;
        try{
            data=await Contest.deleteMany({cID:cID});
        }catch(err){
            return res.send("NOT OKAY" + err)
        }
        try{
            data=await UserContest.deleteMany({cID:cID});
        }catch(err){
            return res.send("NOT OKAY"+err);
        }
        try{
            data=await executionTime.deleteMany({cID:cID});
        }
        catch(err){
            return res.send("NOT OKAY"+err);
        }
        res.send(data);
    }catch(err){
        console.log(err);
        res.send("not okay");
    }
});
app.listen(port, process.env.IP, function () {
    console.log("Server Started...... ");
});