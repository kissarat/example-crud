const _ = require("lodash");
const bodyParser = require("body-parser");
const morozov = require("./morozov");
const express = require("express");
const passport = require("passport");
const passportRouter = require("./passport");
const pkg = require("../package");
const session = require("./session");
const config = require("../config");

function main(options = {}) {
  Object.assign(config, options);
  config.port = +config.port > 0 ? +config.port : 8080;
  return new Promise(function (resolve, reject) {
    try {
      const app = express();

      app.use(express.static(__dirname + "/../public"));
      app.use(bodyParser.json());
      app.use(passport.initialize());
      app.use(session);

      const api = new express.Router();

      api.use("/auth", passportRouter);
      api.get("/", function (req, res) {
        const p = _.pick(pkg, "name", "version", "description");
        p.ok = true;
        res.json(p);
      });
      if ("production" !== process.env.NODE_ENV) {
        api.use(morozov(options));
      }

      app.use("/api", api);

      app.use(function (req, res) {
        res.status(404);
        res.json({
          ok: false,
          message: `Page ${req.url} not found`,
          client: _.pick(req, "url", "method", "headers")
        });
      });

      const server = app.listen(config.port, function() {
        resolve(server);
      });
    }
    catch (err) {
      reject(err);
    }
  });
}

module.exports = main;
