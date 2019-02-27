const passport = require("passport");
const express = require("express");

const strategies = ["local"];

const router = new express.Router();

for (const strategy of strategies) {
  passport.use(require("./" + strategy));
  const method = "local" === strategy ? "post" : "get";
  router[method]("/" + strategy, passport.authenticate(strategy), function(req, res) {
    res.json({
      ok: req.isAuthenticated(),
      user: req.user
    });
  });
}

module.exports = router;
