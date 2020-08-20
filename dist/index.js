const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db.js");
var citoyenController = require("./controllers/citoyenController2.js");
var app = express();
app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/app/"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/app/index.html");
});
app.listen(80, () => {
  console.log("server started at port 80");
});

app.use("/", citoyenController);

app.use(function (req, res) {
  res.status(404).sendFile(process.cwd()+"/app/index.html")
})