const main = require("./main");
const { getOptions } = require("auxiliary/utilities");
const mysql = require("./mysql");
const pkg = require("../package");
const config = require("../config");

process.title = pkg.name;

main(...getOptions())
    .then(function () {
        console.log(`Listen at ${config.port}`)
    })
    .catch(function (err) {
        console.error(err);
        process.exit();
    });

process.on("uncaughtException", function (err) {
    console.error(err);
    if ("EADDRINUSE" === err.code) {
        process.exit();
    }
});

process.on("SIGINT", function () {
    mysql.end();
    console.log("MySQL connections closed");
    process.exit();
});
