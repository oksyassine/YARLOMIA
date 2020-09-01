const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
var busboy = require("connect-busboy");
var router = express.Router();
const EventEmitter = require("events");
const Stream = new EventEmitter();
var ObjectId = require("mongoose").Types.ObjectId;
router.use(cors());
router.use(busboy());
var k = 0,
  j = 0;
var db;
var connLocal = mongoose.createConnection(
  "mongodb://admin:Gseii2021@52.148.245.219:3306/idemia?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const citoyen = connLocal.model(
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
  if (connLocal.readyState == 1 || connLocal.readyState == 2) {
    citoyen.find((err, docs) => {
      if (!err) {
        res.set("Access-Control-Allow-Origin", "*");
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
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  });
  if(db)
    res.write("event: db\n" + "data: " + db + "\n\n");
  Stream.on("push", function (event, data) {
    res.write("event: " + String(event) + "\n" + "data: " + data + "\n\n");
  });
});

router.get("/api/db", (req, res) => {
  if (connLocal.readyState == 1 || connLocal.readyState == 2)
  res.status(200).end();
  else
  res.status(404).end();
});

connLocal.on("connected", () => {
  k++;
  if (k % 2 == 1) {
    Stream.emit("push", "db", "y");
    db="y";
    console.log("connected to mongodb");
  }
  if (k == 7) {
    k = 0;
  }
});

connLocal.on("disconnected", () => {
  j++;
  if (j % 2 == 1) {
    console.log("connection disconnected");
    Stream.emit("push", "db", "n");
    db="n";
  }
  if (j == 7) {
    j = 0;
  }
});

router.post("/api/form", (req, res) => {

  console.log("--------------------st-----------------");
  if (connLocal.readyState == 1 || connLocal.readyState == 2) {
    console.log("--------------------if------------------");
    var cit = new citoyen({
      _id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cin: req.body.cin,
      address: req.body.address,
      sexe: req.body.sexe,
    });
    console.log("value is: "+req.body._id);
    citoyen.collection.insertOne(cit, (err, doc) => {
      if (!err) {
        console.log("--------------------insert operation------------------");
        console.log(doc.ops[0]._id + " succesfully inserted to the local db");
        console.log("--------------------insert operation------------------");
        res.set("Access-Control-Allow-Origin", "https://yarlomia.ga");
        res.send({ _id: doc.ops[0]._id });
      } else {
        console.log("-----------> failed to save in the local db");
      }
    });
  } else {
    console.log("-----------> error inserting data in local db");
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
      res.set("Access-Control-Allow-Origin", "https://yarlomia.ga");
      res.send({ success: true });
      if (connLocal.readyState == 1 || connLocal.readyState == 2) {
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
            console.log(" succesfully updated in the local db");
            console.log(
              "--------------------update operation------------------"
            );
          })
          .catch(function () {
            console.log("");
          });
      } else {
        console.log("-----------> error inserting pdp image in local db");
      }
    });
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = value
    //field = field._id;
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
      console.log("uploading..");
    });
    file.on("end", function () {
      buf = Buffer.concat(chunks);
      binarydata = Buffer.from(buf, "binary").toString("base64");
      fstream = "data:" + mimetype + ";base64, ".concat(binarydata);
      //console.log(fstream);
      res.set("Access-Control-Allow-Origin", "https://yarlomia.ga");
      res.send({ success: true });
      if (connLocal.readyState == 1 || connLocal.readyState == 2) {
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
            console.log(" succesfully updated in the local db");
            console.log(
              "--------------------update operation------------------"
            );
          })
          .catch(function () {
            console.log("");
          });
      } else {
        console.log("-----------> error inserting bio image in local db");
      }
    });
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = value;
    console.log("id is :" + field);
  });
});

module.exports = router;
