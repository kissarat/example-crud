const mysql = require("./mysql");

function query(...args) {
  if ("development" === process.env.NODE_ENV) {
    console.log(...args);
  }
  return new Promise(function(resolve, reject) {
    return mysql.query(...args, function(err, rows) {
      if (err) {
        reject(err);
      }
      else {
        resolve(rows);
      }
    })
  })
}

module.exports = query;
