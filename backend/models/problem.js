var mongoose= require("mongoose");
mongoose.connect("mongodb://localhost/test");

var problem= new mongoose.Schema({
    pID : Number,
    testID : Number,
    timeAllot:Number,
});

module.exports= mongoose.model("problem",problem);