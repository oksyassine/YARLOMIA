const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db.js");
var citoyenController = require("./controllers/serverController.js");
var app = express();
app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/app/"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/app/index.html");
});
const PORT=3000;
app.listen(PORT, () => {
  console.log("server started at port "+PORT);
});

app.use("/", citoyenController);

app.use(function (req, res) {
  res.status(404).sendFile(process.cwd()+"/app/index.html")
})
