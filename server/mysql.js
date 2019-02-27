var mysql = require("mysql");
const config = require("../config");

const NAME = "company";
const mysqlConfig = Object.assign({
    host: "localhost",
    user: NAME,
    password: NAME,
    database: NAME
}, config.mysql || {})
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

module.exports = connection;
