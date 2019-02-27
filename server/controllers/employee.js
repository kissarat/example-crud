const Repository = require("../repository");
const express = require("express");
const validate = require("../validate");
const _ = require("lodash");
const { check } = require("../responses");

module.exports = function () {
  const router = new express.Router();

  router.get("/", function (req, res) {
    const page = _.pick(req, "skip", "limit", "count")
    if (check(res, validate.pagination(page))) {
      res.json({
        ok: true,
        page,
        items: null
      });
    }
  });

  return router;
}
