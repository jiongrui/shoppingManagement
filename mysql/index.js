const mysql = require("mysql");

module.exports = function operateMysql(query) {
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

  //修改字段数据类型
  // const query = `alter table products modify brand int,modify type int`;

  //新增数据
  // const query = `insert into products (name,brand,volume,important,type) values
  // ('what',1,50,2,6),('what2',1,70,2,5),('haha',1,50,4,2),('niu',1,50,3,3),('shadx',1,90,2,1)`;

  //执行操作
  let result;
  connection.query(query, function(error, results, fields) {
    if (error) throw error;
    result = results;
    console.log("The result is: ", results);
  });
  connection.end();
  return result;
};
