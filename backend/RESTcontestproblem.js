var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3005;


var contestproblem=require("./models/contestproblem");
var Contest=require("./models/contest");
var problem=require("./models/problem");

app.post("/linkContestProblem/:cID",async function(req,res){
    try{
        try{
            var cID=parseInt(req.params.cID);
        }catch(err){
            return res.send("some error"+err);
        }
        let data;
        try{
            data=await Contest.find({cID:cID});
        }catch(err){
            return res.send("some database error"+err);
        }
        if(data.length==0) return res.send("no such Contest Exist");
        var arr=req.body.pID,i;
        if(arr.length!=2) return res.send("Strictly 2 problems in a single contest");
            for(i=0;i<arr.length;i++){
                try{
                    data=await problem.find({pID:arr[i]});
                }catch(err){
                    return res.send("Some error in database traversal problem"+err);
                }
                if(data.length==0)return res.send(arr[i]+" PID problem does not exist");
            }
            try{
                var datajson=[];
                for(i=0;i<arr.length;i++){
                    datajson.push({cID:cID,pID:arr[i]});
                }
                data=await contestproblem.find({cID:cID});
                console.log(data);
                if(data.length!=0) return res.send("Contest Already Registered");
                data=await contestproblem.insertMany(datajson);
            }catch(err){
                return res.send("Some error in database insertion"+err);
            }
            console.log(data);
            return res.send("OKAY");
    }catch(err){
        return res.send("Some Error in funciton"+err);
    }
});

app.listen(port, process.env.IP, function () {
    console.log("Server Started...... ");
});


// try{

// }catch(err){
//     return res.send("");
// }