var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");

var User= new mongoose.Schema({
    uID : {type:Number,unique: true},
    uName : String,
    uEmail : String,
});

module.exports= mongoose.model("User",User);