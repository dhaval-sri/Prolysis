var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");

var contest= new mongoose.Schema({
    cID : {type:Number,unique:true},
    cName : String,
    cDate : Date,
    cTime : Date,
    cDuration: Number //minutes
});

module.exports= mongoose.model("contest",contest);