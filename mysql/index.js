var express = require("express");
const bodyParser = require("body-parser");
const {
  GET_API,
  POST_API
} = require("./api");
const {
  mysqlDealData,
  mongodbDealData
} = require("./request");
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET"); //PUT, DELETE, OPTIONS
  res.header("X-Powered-By", "3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

GET_API.forEach(url => {
  app.get(url, mongodbDealData);
});
POST_API.forEach(url => {
  app.post(url, mongodbDealData);
});

const server = app.listen(8985, function () {
  const url = server.address();
  const host = url.address;
  const port = url.port;
  console.log("Example is listen in %s%s", host, port);
});
