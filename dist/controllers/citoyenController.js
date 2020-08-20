const express = require("express");
const multipart = require("connect-multiparty");
const mongoose = require("mongoose");
var busboy = require("connect-busboy");
const multipartMiddleware = multipart({ uploadDir: "./uploads" });
console.log("im here");
var router = express.Router();
router.use(busboy());
var ObjectId = require("mongoose").Types.ObjectId;
var { citoyen } = require("../models/citoyen.js");
const { json } = require("body-parser");
router.get("/api/state", (req, res) => {
  res.status(200).end();
});
router.get("/getAll", (req, res) => {
  mongoose.connect(
    "mongodb://admin:Gseii2021@52.148.194.128:27017/ensa?authSource=admin",

    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (!err) {
        console.log("succesfully connected to distant db");
        citoyen.find((err, docs) => {
          if (!err) {
            res.send(docs);
          } else {
            console.log("error finding data");
          }
        });
        mongoose.connection.close();
      } else {
        mongoose.connection.close();
        console.log("failed to connect to the distant database");
        //insertInLocal(cit, res);
      }
    }
  );
});
router.get("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("No receord with given id : ${req.params.id}");
  }
  citoyen.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("failed to find the id");
    }
  });
});
router.put("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("No receord with given id : ${req.params.id}");
  }
  var cit = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    cin: req.body.cin,
    address: req.body.address,
    sexe: req.body.sexe,
  };
  citoyen.findByIdAndUpdate(
    req.params.id,
    { $set: cit },
    { new: true },
    (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("failed to update");
      }
    }
  );
});
router.post("/api/form", (req, res) => {
  var cit = new citoyen({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    cin: req.body.cin,
    address: req.body.address,
    sexe: req.body.sexe,
  });
  //"mongodb://localhost:27017/great",
  mongoose.connect(
    "mongodb://admin:Gseii2021@52.148.194.128:27017/ensa?authSource=admin",

    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (!err) {
        console.log("succesfully connected to distant db");
        citoyen.collection.insertOne(cit, (err, doc) => {
          if (!err) {
            console.log(doc.ops[0]._id);
            res.send({ _id: doc.ops[0]._id });
          } else {
            console.log("failed to save");
          }
        });

        mongoose.connection.close();
      } else {
        mongoose.connection.close();
        console.log("failed to connect to the distant database");
        insertInLocal(cit, res);
      }
    }
  );
  mongoose.set("useFindAndModify", true);
});
/*router.post("/api/upload", (req, res) => {
  console.log(req.body);
});*/
router.post("/api/upload/bi", function (req, res) {
  req.pipe(req.busboy);
  console.log(req);
});
router.post("/api/upload/bio", function (req, res) {
  var fstream;
  var field;
  req.pipe(req.busboy);
  console.log(req.body);
  req.busboy.on("file", function (fieldname, file, filename) {
    console.log("Uploading: " + filename + " " + fieldname + " empty");
    const chunks = [];
    file.on("data", function (chunk) {
      //console.log(chunk);
      chunks.push(chunk);
      console.log("done");
    });
    // Send the buffer or you can put it into a var
    file.on("end", function () {
      console.log("----------------------------------------");
      //console.log(chunks);
      buf = Buffer.concat(chunks);
      fstream = buf;
      res.send({ success: true });
      //console.log(Buffer.from(buf, "binary").toString("base64"));
      //"mongodb://localhost:27017/great", { useNewUrlParser: true, useUnifiedTopology: true },
    });

    //file.pipe(process.stdout)
    //console.log(file);
  });
  req.busboy.on("field", function (fieldname, value) {
    console.log("The value is: " + fieldname + "   " + value);
    field = JSON.parse(value);
    field = field._id;
    console.log("id is :" + field);
  });
  mongoose.connect(
    "mongodb://admin:Gseii2021@52.148.194.128:27017/ensa?authSource=admin",
    (err) => {
      if (!err) {
        console.log("succesfully connected");
        citoyen.collection
          .updateOne(
            { _id: ObjectId(field) },
            { $set: { pdp: fstream } },
            { upsert: true }
          )
          .then(function () {
            if (err) throw err;
            console.log(req.params.id);
          })
          .catch(function () {
            console.log("Promise Rejected");
          });
        mongoose.connection.close();
      } else {
        mongoose.connection.close();
        // updateInLocal(buf, ObjectId("5f3b103421fa10454c66bd9c"));
        mongoose.connect(
          "mongodb://admin:Gseii2021@52.148.245.219:27017/ensa?authSource=admin",
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }
        );
        mongoose.connection.on("connected", () => {
          console.log(`Mongoose connected`);
          citoyen.collection
            .updateOne(
              { _id: ObjectId(field) },
              { $set: { pdp: fstream } },
              { upsert: true }
            )
            .then(function () {
              if (err) throw err;
              mongoose.connection.close();
              //console.log(ctrl.obj);
            })
            .catch(function () {
              console.log("Promise Rejected");
            });
        });
      }
    }
  );
  mongoose.set("useFindAndModify", true);
});
router.delete("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("No receord with given id : ${req.params.id}");
  }
  citoyen.collection.deleteOne(ObjectId(req.params.id), (err, docs) => {
    if (!err) {
      res.send("deleted");
    } else {
      console.log("failed to delete");
    }
  });
  /*citoyen.findOneAndDelete(ObjectId(req.params.id), (err, docs) => {
      if (!err) {
        res.send("deleted");
      } else {
        console.log("failed to delete");
      }
    });*/
});

function insertInLocal(cit, res) {
  mongoose.connect(
    "mongodb://admin:Gseii2021@52.148.245.219:27017/ensa?authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  mongoose.connection.on("connected", () => {
    console.log(`Mongoose connected`);
    cit.save((err, doc) => {
      if (!err) {
        console.log(typeof doc);
        res.send({ _id: doc._id });
        mongoose.connection.close();
      } else {
        mongoose.connection.close();
        console.log("failed to save in local db");
      }
    });
  });
}

function updateInLocal(buf, id) {
  mongoose.connect(
    "mongodb://admin:Gseii2021@52.148.245.219:27017/ensa?authSource=admin",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (!err) {
        console.log("succesfully connected in local db");
        citoyen.collection
          .updateOne(
            { _id: ObjectId("5f3c2f50c518f3206e526895") },
            { $set: { pdp: buf } },
            { upsert: true }
          )
          .then(function () {
            if (err) throw err;
            console.log(id);
          })
          .catch(function () {
            console.log("Promise Rejected");
          });
        mongoose.connection.close();
      } else {
        mongoose.connection.close();
        console.log("failed to connect to database");
      }
    }
  );
}
module.exports = router;
