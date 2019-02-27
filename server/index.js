const main = require("./main");
const { getOptions } = require("auxiliary/utilities");
const mysql = require("./mysql");
const config = require("../config");
const pkg = require("../package");

process.title = pkg.name;

// Not recursive
const [options, ...args] = getOptions();
Object.assign(options, config);
main(options, ...args);

process.on("uncaughtException", function (err) {
    console.error(err);
})

process.on("SIGINT", function () {
    mysql.end();
    console.log("MySQL connections closed");
    process.exit();
})
