var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");


var Contest_problem= new mongoose.Schema({
    cID : Number,
    pID : Number
});


module.exports= mongoose.model("contestproblem",Contest_problem);