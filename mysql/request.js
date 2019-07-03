var express = require("express");
console.log("express", express);
const bodyParser = require("body-parser");
// const BASE_URL = 'http://localhost/';
const API = require("./api");
const operateMysql = require("./index");

// module.exports =
const app = express();

console.log("app", app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("X-Powered-By", "3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

Object.keys(API).forEach(url => {
  app.get(url, function(req, res) {
    const result = operateMysql(API[url]);
    console.log("result....", result);
    res.status(200);
    res.json(result);
  });
});

// app.get("/userinfo", function(req, res) {
//   res.status(200);
//   res.json(options);
// });

// app.post("/submit", function(req, res) {
//   console.log("post req", req);
//   res.json(req.body);
// });

var server = app.listen(3011, function() {
  const url = server.address();
  const host = url.address;
  const port = url.port;
  console.log("Example is listen in %s%s", host, port);
});
