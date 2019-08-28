var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");

var Code= new mongoose.Schema({
    codenumber : Number,
    isUsed     : Boolean,
    isActivated :  Boolean
});

module.exports= mongoose.model("Code",Code);