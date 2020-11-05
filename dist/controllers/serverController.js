const express = require("express");
const mongoose = require("mongoose");
var busboy = require("connect-busboy");
var router = express.Router();
const EventEmitter = require("events");
const Stream = new EventEmitter();
var ObjectId = require("mongoose").Types.ObjectId;
var db;
router.use(busboy());

Stream.setMaxListeners(0);
var connDistant = mongoose.createConnection(
  "mongodb://admin:Gseii2021@152.67.67.205:3306,140.238.173.49:3306,140.238.209.10:3306/idemia?authSource=admin&replicaSet=rs",
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 100000
  }
);
connDistant.catch(err => console.log(err));
const citoyen = connDistant.model(
  "citoyen",
  {
    _id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    cin: { type: String },
    address: { type: String },
    sexe: { type: String },
  },
  "coll"
);

router.get("/api/getAll", (req, res) => {
  if (connDistant.readyState == 1 || connDistant.readyState == 2) {
    citoyen.find((err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("error finding data");
      }
    });
  } else {
    res.status(500);
  }
});

router.get("/api/state", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream;charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  if(db)
    res.write("event: dbx\n" + "data: " + db + "\n\n");
  Stream.on("push", function (event, data) {
     console.log(data+" is emitted")
    res.write("event: " + String(event) + "\n" + "data: " + data + "\n\n");
  });
});

connDistant.on("open", () => {

    Stream.emit("push", "dbx", "y");
    db="y";
    console.log("open to mongodb");

});

connDistant.on("disconnected", () => {

    console.log("connection disconnected");
    Stream.emit("push", "dbx", "n");
    db="n";

});

router.post("/api/form", (req, res) => {
  if (connDistant.readyState == 1 || connDistant.readyState == 2) {
    var cit = new citoyen({
      _id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cin: req.body.cin,
      address: req.body.address,
      sexe: req.body.sexe,
    });
    citoyen.collection.insertOne(cit, (err, doc) => {
      if (!err) {
        console.log("--------------------insert operation------------------");
        console.log(doc.ops[0]._id + " succesfully inserted to the distant db");
        console.log("--------------------insert operation------------------");
        res.send({ _id: doc.ops[0]._id });
      } else {
        console.log("-----------> failed to save in the distant db");
      }
    });
  } else {
    console.log("-----------> error inserting data in distant db");
  }
});

router.post("/api/upload/pic", function (req, res) {
  var fstream;
  var field;
  req.pipe(req.busboy);
  req.busboy.on("file", function (
    fieldname,
    file,
    filename,
    encoding,
    mimetype
  ) {
    const chunks = [];
    file.on("data", function (chunk) {
      chunks.push(chunk);
    });
    file.on("end", function () {
      buf = Buffer.concat(chunks);
      binarydata = Buffer.from(buf, "binary").toString("base64");
      fstream = "data:" + mimetype + ";base64, ".concat(binarydata);
      res.send({ success: true });
      if (connDistant.readyState == 1 || connDistant.readyState == 2) {
        citoyen.collection
          .updateOne(
            { _id: field },
            { $set: { pic: fstream } },
            { upsert: true }
          )
          .then(function () {
            if (err) throw err;
            console.log(
              "--------------------update operation------------------"
            );
            console.log(" succesfully updated in the distant db");
            console.log(
              "--------------------update operation------------------"
            );
          })
          .catch(function () {
            console.log("");
          });
      } else {
        console.log("-----------> error inserting pdp image in distant db");
      }
    });
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = value;
  });
});

router.post("/api/upload/bio", function (req, res) {
  var fstream;
  var field;
  req.pipe(req.busboy);
  req.busboy.on("file", function (
    fieldname,
    file,
    filename,
    encoding,
    mimetype
  ) {
    const chunks = [];
    file.on("data", function (chunk) {
      //console.log(chunk);
      chunks.push(chunk);
      console.log("done");
    });
    file.on("end", function () {
      buf = Buffer.concat(chunks);
      binarydata = Buffer.from(buf, "binary").toString("base64");
      fstream = "data:" + mimetype + ";base64, ".concat(binarydata);
      console.log(fstream);
      res.send({ success: true });
      if (connDistant.readyState == 1 || connDistant.readyState == 2) {
        citoyen.collection
          .updateOne(
            { _id: field },
            { $set: { bio: fstream } },
            { upsert: true }
          )
          .then(function () {
            if (err) throw err;
            console.log(
              "--------------------update operation------------------"
            );
            console.log(" succesfully updated in the distant db");
            console.log(
              "--------------------update operation------------------"
            );
          })
          .catch(function () {
            console.log("");
          });
      } else {
        console.log("-----------> error inserting bio image in distant db");
      }
    });
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = value;
  });
});

module.exports = router;
