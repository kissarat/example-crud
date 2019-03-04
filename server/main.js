const _ = require("lodash");
const bodyParser = require("body-parser");
const morozov = require("./morozov");
const express = require("express");
const pkg = require("../package");
const config = require("../config");
const controllers = require('./controllers');
const path = require("path");

const STATIC_DIR = path.resolve(__dirname + "/../client/public");

function main(options = {}) {
  Object.assign(config, options);
  config.port = +config.port
  if (!config.port) {
    config.port = 8080;
  }
  return new Promise(function (resolve, reject) {
    try {
      const app = express();

      app.use(bodyParser.json());

      const api = new express.Router();

      api.get("/", function (req, res) {
        const p = _.pick(pkg, "name", "version", "description");
        p.ok = true;
        res.json(p);
      });
      if ("production" !== process.env.NODE_ENV) {
        api.use(morozov(options));
      }

      api.use(controllers(options));
      app.use("/api", api);
      app.use(function(req, res, next) {
        if (/^[\/\w]+$/.test(req.url)) {
          res.sendFile(STATIC_DIR + "/index.html", {
            headers: {
              "content-type": "text/html"
            }
          })
        }
        else {
          next();
        }
      });
      app.use(express.static(STATIC_DIR));

      app.use(function (req, res) {
        res.status(404);
        res.json({
          ok: false,
          message: `Page ${req.url} not found`,
          client: _.pick(req, "url", "method", "headers")
        });
      });

      const server = app.listen(config.port, function () {
        resolve(server);
      });
    }
    catch (err) {
      reject(err);
    }
  });
}

module.exports = main;
