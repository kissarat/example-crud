const main = require("./main");
const { getOptions } = require("auxiliary/utilities");
const mysql = require("./mysql");

main(...getOptions());

process.on("uncaughtException", function (err) {
    console.error(err);
})

process.on("exit", function () {
    mysql.end();
    console.log("MySQL connections closed");
})
