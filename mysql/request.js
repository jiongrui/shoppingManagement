const mysql = require("mysql");
const MongoClient = require("mongodb").MongoClient;
const getQuery = require("./query");
const mongodbUrl = "mongodb://localhost:27017/";

exports.mongodbDealData = function(req, res) {
  MongoClient.connect(
    mongodbUrl,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) throw err;
      const dbo = db.db("shopping");
      console.log("shopping reate success");
      dealQuery(req, res, dbo);
    }
  );
};

function dealQuery(req, res, dbo) {
  const query = req.query;
  const method = req.method;
  const url = req._parsedUrl.pathname;
  const urlList = url.split("/");
  const len = urlList.length;
  const tableName = urlList[len - 2];
  const operate = urlList[len - 1];

  const operations = {
    list: function() {
      const keys = Object.keys(query);
      const len = keys.length;
      const sortTypes = {
        "+": 1,
        "-": -1
      };
      let page,
        limit = 20,
        skip = 0,
        sort = {};

      const where = {};
      for (let i = 0; i < len; i++) {
        const key = keys[i];
        const value = query[key];
        if (key === "sort") {
          const type = value.substring(0, 1);
          if (type === "+" || type === "-") {
            console.log(type, sortTypes[type], value.substring(1));
            sort[value.substring(1)] = sortTypes[type];
            continue;
          }
        } else if (key === "page") {
          page = value;
          continue;
        } else if (key === "limit") {
          limit = +value;
          continue;
        }
        where[key] = value;
      }

      if (page && limit) {
        skip = (page - 1) * limit;
      }

      console.log(tableName, where, sort, skip, limit);

      dbo
        .collection(tableName)
        .find(where)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(function(err, results) {
          if (err) throw err;
          console.log("The result is: ", results);
          const result = {
            msg: "ok",
            code: 0
          };
          if (method === "GET") {
            result.data = results;
            result.total = results.length;
          }
          res.json(result);
          dbo.close();
        });
    }
  };

  operations[operate]();
  // return queryObject[url](tableName, query);
}

exports.mysqlDealData = function(req, res) {
  console.log("req....", req);
  // console.log("res", res);

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "shopping"
  });

  connection.connect();

  //创建products表
  // const query = `CREATE TABLE IF NOT EXISTS products (
  //   id INT PRIMARY KEY AUTO_INCREMENT,
  //   name varchar(60) not null,
  //   brand int,
  //   volume int,
  //   important int default 1,
  //   type int
  // )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  //创建product_types表
  // const query = `CREATE TABLE IF NOT EXISTS product_types (
  //   id INT(4) PRIMARY KEY AUTO_INCREMENT,
  //   name varchar(60) not null
  // )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  //创建product_imps表
  // const query = `CREATE TABLE IF NOT EXISTS product_imps(
  //   id INT(4) PRIMARY KEY AUTO_INCREMENT,
  //   important INT(2) not null
  // )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  //创建product_specs表
  // const query = `CREATE TABLE IF NOT EXISTS product_specs(
  //   id INT(4) PRIMARY KEY AUTO_INCREMENT,
  //   name varchar(60) not null
  // )ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  //修改字段数据类型
  // const query = `alter table products modify brand int,modify type int`;

  //新增数据
  // const query = `insert into products (name,brand,volume,important,type) values
  // ('what',1,50,2,6),('what2',1,70,2,5),('haha',1,50,4,2),('niu',1,50,3,3),('shadx',1,90,2,1)`;
  const query = getQuery(req);
  // console.log("query", query);
  connection.query(query, function(error, results, fields) {
    // console.log("req.....", req);
    // console.log("res.....", res);
    if (error) throw error;

    // const arr = [];
    // for (let i = 0, len = results.length; i < len; i++) {
    //   arr.push(results[i]);
    // }
    console.log("The result is: ", results);
    // console.log("arr", arr);
    const result = {
      msg: "ok",
      code: 0
    };
    if (req.method === "GET") {
      result.data = results;
      result.total = results.length;
    }
    res.json(result);
  });
  connection.end();
};
