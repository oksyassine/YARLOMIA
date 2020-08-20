const express = require("express");
const mongoose = require("mongoose");
var busboy = require("connect-busboy");
var router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;
router.use(busboy());
var connDistant = mongoose.createConnection(
  "mongodb://admin:Gseii2021@52.148.194.128:27017/idemia?authSource=admin",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
var connLocal = mongoose.createConnection(
  "mongodb://admin:Gseii2021@52.148.245.219:27017/idemia?authSource=admin",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const citoyen = connDistant.model(
  "citoyen",
  {
    firstName: { type: String },
    lastName: { type: String },
    cin: { type: String },
    address: { type: String },
    sexe: { type: String },
  },
  "coll"
);
const citoyen2 = connLocal.model(
  "citoyen",
  {
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
  if (connDistant.readyState == 1 || connDistant.readyState == 2) {
    res.status(200).end();
  } else {
    res.status(202).end();
  }
});

router.post("/api/form", (req, res) => {
  console.log(connDistant.readyState);
  if (connDistant.readyState == 1 || connDistant.readyState == 2) {
    var cit = new citoyen({
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
        console.log("failed to save in the distant db");
      }
    });
  } else {
    var cit = new citoyen2({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cin: req.body.cin,
      address: req.body.address,
      sexe: req.body.sexe,
    });
    citoyen2.collection.insertOne(cit, (err, doc) => {
      if (!err) {
        console.log("--------------------insert operation------------------");
        console.log(doc.ops[0]._id + " succesfully inserted to the local db");
        console.log("--------------------insert operation------------------");
        res.send({ _id: doc.ops[0]._id });
      } else {
        console.log("failed to save in the local db");
      }
    });
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
            { _id: ObjectId(field) },
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
        citoyen2.collection
          .updateOne(
            { _id: ObjectId(field) },
            { $set: { pic: fstream } },
            { upsert: true }
          )
          .then(function () {
            if (err) throw err;
            console.log(
              "--------------------update operation------------------"
            );
            console.log("pdp image is succesfully inserted in the local db");
            console.log(
              "--------------------update operation------------------"
            );
          })
          .catch(function () {
            console.log("");
          });
      }
    });
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = JSON.parse(value);
    field = field._id;
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
            { _id: ObjectId(field) },
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
        citoyen2.collection
          .updateOne(
            { _id: ObjectId(field) },
            { $set: { bio: fstream } },
            { upsert: true }
          )
          .then(function () {
            if (err) throw err;

            console.log(
              "--------------------update operation------------------"
            );
            console.log("bio image is succesfully inserted in the local db");
            console.log(
              "--------------------update operation------------------"
            );
          })
          .catch(function () {
            console.log("");
          });
      }
    });
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = JSON.parse(value);
    field = field._id;
    console.log("id is :" + field);
  });
});

module.exports = router;
