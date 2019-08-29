var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



const port = 3000;
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function (callback) {
    //The code in this asynchronous callback block is executed after connecting to MongoDB. 
    console.log('Successfully connected to MongoDB.');
});

var TimeTaken = require("./models/executetimetaken");
var User = require("./models/user");
var UserContest = require("./models/user_contest");
var ContestProblem = require("./models/contestproblem");
var Problem = require("./models/problem");
var Contest = require("./models/contest");

app.get("/Scene1/:contestID", function (req, res) {
    var contestID = req.params.contestID;
    UserContest.find({ cID: contestID }, async function (err, data) {
        if (err) {
            console.log(err);
            res.send("ContestID Does not Exist");
        }
        else {
            var len = data.length;
            if (len == 0) {
                res.send([]);
            }
            else {
                var arr = [];
                var tmp;
                var i;
                for (i = 0; i < len; i++) {

                    tmp = data[i];
                    await User.find({ uID: tmp.uID }, function (err, data1) {
                        if (err) {
                            console.log("ERROR AT USER FETCHING in Scene1");
                            console.log(err);
                        }
                        else {
                            if (data1.length == 0) {
                                console.log("User does not exist");
                            }
                            else {
                                console.log(data1);
                                data1 = data1[0];
                                arr.push({ "uName": data1.uName, "uID": data1.uID });
                            }
                        }
                    });
                }
                res.send(arr);
            }
        }
    });
});

app.get("/Scene1/:contestID/:uID", async function (req, res) {
    var userID = req.params.uID;
    var contestID = req.params.contestID;
    await User.find({ uID: userID }, async function (err, data) {
        if (err) {
            console.log(err);
            res.send("Some error in database connection");
        } else {
            var len = data.length;
            if (len == 0) {
                res.send("User Does not exist");
            }
            else {
                data = data[0];
                var graphData = [];
                var result = { "uName": data.uName, "contestID": parseInt(contestID), "uID": data.uID, "uEmail": data.uEmail };
                await ContestProblem.find({ cID: contestID }, async function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (data.length == 0) {
                            res.send("contest doest not exist");
                        } else {

                            var index;
                            for (index = 0; index < data.length; index++) {
                                var ele = data[index];
                                var problemID = ele.pID;
                                var testCase = 0;
                                await Problem.find({ pID: problemID }, async function (err, dataProblem) {
                                    if (err) {
                                        console.log("Some Error");
                                    } else {
                                        testCase = dataProblem.length;
                                    }
                                }).then(async () => {
                                    var arrForeachAttempt = [];
                                    await TimeTaken.find({ uID: userID, cID: contestID, pID: problemID }, await function (err, data1) {
                                        if (err) {
                                            res.send("some error in database");
                                        } else {
                                            if (data1.length == 0) {
                                                graphData.push({ "pID": problemID, "x": "No Of Attempts", "y": "Time", "data": [] });
                                                console.log(graphData);
                                            } else {
                                                var max = -1;
                                                var i, j;
                                                for (var i = 0; i < data1.length; i++) {
                                                    if (data1[i].attemptNo > max) max = data1[i].attemptNo;
                                                }
                                                console.log(max);
                                                if (max == -1) {
                                                    for (j = 1; j <= testCase; j++) { //j holds testCasesID
                                                        testArr.push(-1);
                                                    }
                                                    arrForeachAttempt.push(testArr);
                                                    testArr = [];
                                                    console.log(arrForeachAttempt);
                                                } else {
                                                    var testArr = [];
                                                    for (i = 1; i <= max; i++) { //i holds attemptNo.
                                                        for (j = 1; j <= testCase; j++) { //j holds testCasesID
                                                            data1.forEach((dataele) => {
                                                                if (dataele.attemptNo == i) {
                                                                    if (dataele.testID == j) {
                                                                        testArr.push(dataele.timeTaken);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                        arrForeachAttempt.push(testArr);
                                                        testArr = [];
                                                    }
                                                    console.log(arrForeachAttempt);

                                                }
                                                console.log(data1);
                                                console.log(testCase);
                                                graphData.push({ "pID": index + 1, "x": "No Of Attempts", "y": "Time", "data": arrForeachAttempt });
                                                arrForeachAttempt = [];
                                            }

                                        }
                                    });

                                });

                            }
                            result.data = graphData;
                            console.log(result);
                            res.send(result);

                        }

                    }
                });
            }
        }
    });
});

app.post("/TimeTaken/:uID/:cID/:pID", async function (req, res) {
    try {
        var key = req.query.key;
        var uID = req.params.uID;
        var cID = req.params.cID;
        var pID = req.params.pID;
        var i, j;
        var date = Date.now();
        if (key == "1122") {
            var h = req.rawHeaders, i, test = -1, count = 0;
            // console.log(h);
            var arr = [], isnum, val, isnum1, val1;
            for (i = 0; i < h.length; i++) {
                if (h[i] == 'done') {
                    test = 0;
                    break;
                }
                if (i % 2 != 0) {
                    val = h[i - 1].toString();
                    isnum = /^\d+$/.test(val);
                    val1 = h[i].toString();
                    isnum1 = /^\d+$/.test(val1);
                    // console.log(parseInt(val));
                    if (val != "-1" && !isnum) {
                        return res.send("something wrong in header");
                    }
                    if (val1 != "-1" && !isnum1) {
                        return res.send("something wrong in header");
                    }
                    if (val == null) return res.send("something wrong in header");
                    if (val1 == null) return res.send("something wrong in header");
                    arr.push({ testID: h[i - 1], timeTaken: h[i] });
                }
                count++;
            }
            if (test == -1) {
                return res.send("something wrong in header");
            }
            if (count == 0 || count % 2 != 0) {
                return res.send("something wrong in header");
            }
            // console.log(arr);
            if (arr.length == 0) return res.send("something wrong in header");
            let data;
            try {
                data = await User.find({ uID: uID });
            } catch (err) {
                return res.send("not okay" + err);
            }
            if (data.length == 0) {
                return res.send("no such user exist");
            }
            try {
                data = await Contest.find({ cID: cID });
            } catch (err) {
                return res.send("not okay" + err);
            }
            if (data.length == 0) {
                return res.send("no such Contest exist");
            }
            try {
                data = await Problem.find({ pID: pID });
            } catch (err) {
                return res.send("not okay" + err);
            }
            if (data.length == 0) {
                return res.send("no such problem exist");
            }
            var noOfTestCases = data.length;
            try {
                data = await UserContest.find({ cID: cID, uID: uID });
            } catch (err) {
                return res.send("not okat at usercontest" + err)
            }
            if (data.length == 0) {
                return res.send("user not registered in this contest");
            }
            try {
                for (i = 0; i < arr.length; i++) {
                    let data1;
                    try {
                        data1 = await Problem.find({ pID: pID, testID: arr[i].testID });
                    } catch (err) {
                        return res.send("Some Error in database problem-test checking");
                    }
                    if (data1.length == 0) return res.send("TestId not found in problem ");
                }
            } catch (err) {
                return res.send("not okay at problem and test" + err);
            }
            //extract the attemptNo from TimeTaken
            try {
                data = await TimeTaken.find({ uID: uID, cID: cID, pID: pID });
            } catch (err) {
                return res.send("Error in extratcting attemptNo." + err);
            }
            var attemptNo = 0, max = -1;
            if (data.length == 0) attemptNo = 1;
            else {
                for (i = 0; i < data.length; i++) {
                    if (data[i].attemptNo > max) max = data[i].attemptNo;
                }
                attemptNo = max + 1;
            }
            try {
                if (noOfTestCases == 0) return res.send("TestCase Zero in Database");
                data = await Problem.find({ pID: pID });
                console.log(data)
                var check;
                let insertData;

                for (i = 0; i < data.length; i++) {
                    check = -1;
                    for (j = 0; j < arr.length; j++) {
                        if (arr[j].testID == data[i].testID) {
                            // console.log("Yes");
                            try {
                                insertData = await TimeTaken.create({ uID: uID, pID: pID, cID: cID, testID: data[i].testID, clockTime: date, attemptNo: attemptNo, timeTaken: arr[j].timeTaken });
                            } catch (err) {
                                return res.send("Some Error in DataBase" + err);
                            }
                            check = 0;
                            break;
                        }
                    }
                    if (check == -1) {
                        // console.log("no");
                        try {
                            insertData = await TimeTaken.create({ uID: uID, pID: pID, cID: cID, testID: data[i].testID, clockTime: date, attemptNo: attemptNo, timeTaken: -1 });
                        } catch (err) {
                            return res.send("Some Error in DataBase" + err);
                        }
                    }
                }
                console.log(arr);
            } catch (err) {
                return res.send("not okay at insertion" + err);
            }
            // if (data.length == 0) {
            //     return res.send("Problem has not this test case");
            // }
            // try{
            //     data=await TimeTaken.find({pID:pID,})
            // }catch(err){

            // }
            return res.send("all OKay" + data + " " + noOfTestCases);
        }
        else {
            return res.send("not allowed");
        }
    } catch (err) {
        res.send("not okay");
        console.log(err);
    }
});
app.get("/listOfContest", async function (req, res) {
    try {
        let data;
        data = await Contest.find({});
        console.log(data);
        var i, arr = [];
        for (i = 0; i < data.length; i++) {
            arr.push({ name: data[i].cName, id: data[i].cID });
        }
        return res.send(arr);
    } catch (err) {
        return res.send("Something Wrong in function " + err);
    }
});
app.get("/listOfProblem", async function (req, res) {
    try {
        let data;
        data = await Problem.distinct("pID");
        console.log(data);
        return res.send({ "pID": data });
    } catch (err) {
        return res.send("Something Wrong in function " + err);
    }
});

/**below code is a part of 2nd diliverable code */
// app.get("/AllProgrammerData/:pID", async function (req, res) {
//     try {
//         var pID = req.params.pID;
//         let prob, user;
//         try {
//             prob = await Problem.find({ pID: pID });
//         } catch (err) {
//             return res.send("Something Wrong in DataBase" + err);
//         }
//         if (prob.length == 0) return res.send("This pID Does not Exist");
//         try {
//             user = await User.find({});
//         } catch (err) {
//             return res.send("Something Wrong in DataBase " + err);
//         }
//         if (user.length == 0) return res.send([]);
//         var i, j, k, jsondata = [];
//         // console.log(user);
//         for (i = 0; i < user.length; i++) {
//             let contestAttemp;
//             try {
//                 contestAttemp = await TimeTaken.find({ pID: pID, uID: user[i].uID }).distinct("cID");
//             } catch (err) {
//                 return res.send("Some Error in database" + err);
//             }
//             if (contestAttemp.length == 0) continue;
//             // console.log(contestAttemp);
//             var perUserInfo = {};
//             perUserInfo.uName = user[i].uName;
//             perUserInfo.uID = user[i].uID;
//             let perConstestProblems;
//             for (j = 0; j < contestAttemp.length; j++) {
//                 try {
//                     perConstestProblems = await ContestProblem.find({ cID: contestAttemp[j] }).distinct("pID");
//                 } catch (err) {
//                     return res.send("Some Error in database" + err);
//                 } if (perConstestProblems.length == 0) return res.send("No Problems in Contest");
//                 for (k = 0; k < perConstestProblems.length; k++) {
                     
//                 }
//             }
//             jsondata.push(perUserInfo);
//         }
//         return res.send(jsondata);
//     } catch (err) {
//         return res.send("Something Wrong in function " + err);
//     }
// });
app.listen(port, process.env.IP, function () {
    console.log("Server Started...... ");
});


