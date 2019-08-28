var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");

var Time= new mongoose.Schema({
    uID : Number,
    cID : Number,
    pID :  Number,
    testID : Number,
    timeTaken: Number,
    attemptNo:Number,
    clockTime: { type: Date, default: Date.now } 
});

module.exports= mongoose.model("ExecuteTimeTaken",Time);