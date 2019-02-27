var mysql = require("mysql");
const config = require("../config");

const NAME = "company";
if (!config.mysql) {
    config.mysql = {};
}
Object.assign(config.mysql, {
    host: "localhost",
    user: NAME,
    password: NAME,
    database: NAME
})
var connection = mysql.createConnection(config.mysql);
connection.connect();

module.exports = connection;
