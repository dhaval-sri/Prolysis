var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3003;

var problem=require("./models/problem");


/** JSON is parsed in the below function */
app.post("/createProblem/:pID",async function(req,res){
    console.log(req.body);
    var pID=req.params.pID;
    let data;
    try{
        data=await problem.find({pID:pID});
    }catch(err){
        return res.send("Some error"+err);
    }
    if(data.length!=0) return res.send("Problem Already Exist");
    var arr;
    try{
         arr=req.body.testCases;
        var i;
        for(i=0;i<arr.length;i++){
            arr[i].pID=pID;
            if(arr[i].pID==undefined)return res.send("Some error in json");
            if(arr[i].testID==undefined)return res.send("Some error in json");
            if(arr[i].timeAllot==undefined)return res.send("Some error in json");
        }
        console.log(arr);
    }catch(err){
        return res.send("Some Error"+err);
    }
    if(arr.length==0)return res.send("Please enter some testcases Data");
    try{
        data=problem.insertMany(arr);
    }catch(err){
        return res.send("Some Error in insertion"+err);
    }
    return res.send("OKAY");
});

app.listen(port, process.env.IP, function () {
    console.log("Server Started...... ");
});