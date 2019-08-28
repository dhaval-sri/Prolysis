var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");


var User_contest= new mongoose.Schema({
    uID : Number,
    cID : Number
});


module.exports= mongoose.model("usercontest",User_contest);