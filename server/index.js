const bodyParser = require("body-parser");
const config = require("../config");
const express = require("express");
const passport = require("passport");
const passportRouter = require("./passport");
const session = require("./session");
const pkg = require("../package");
const _ = require("lodash");

const app = express();

app.use(express.static(__dirname + "/../public"));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session);

const api = new express.Router();

api.use("/auth", passportRouter);
api.get("/", function(req, res) {
  const p = _.pick(pkg, "name", "version", "description");
  p.ok = true;
  res.json(p);
});
if ("production" !== process.env.NODE_ENV) {
  api.get("/config", function(req, res) {
    res.json({ ok: true, item: config });
  });
}

app.use("/api", api);

app.use(function(req, res) {
  res.status(404);
  res.json({
    ok: false,
    message: `Page ${req.url} not found`,
    client: _.pick(req, "url", "method", "headers")
  });
});

app.listen(config.port || 8085);
