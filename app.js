const express = require("express");
const app = express();

const routes = require("./routes");

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.set("views", "./src/templates/pages");
app.set("view engine", "pug");
app.use(express.static("./dist/"));

app.use("/", routes);



app.get("*", function (req, res) {
    res.render("error", {title: "Ошибка 404"});
});

app.listen(3002, function () {
    console.log("Listen port 3002")
});