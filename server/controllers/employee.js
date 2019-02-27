const Repository = require("../repository");
const express = require("express");
const validate = require("../validate");
const _ = require("lodash");
const { check, caught } = require("../responses");
const query = require("../query");

const queries = {
  select: ({sort, order}) => `select * from tblEmployees join tblDepartments on emp_dpID = dpID order by ${sort} ${order}`
}

module.exports = function () {
  const router = new express.Router();

  router.get("/", caught(async function (req, res) {
    const page = _.pick(req, "skip", "limit", "count")
    if (check(res, validate.pagination(page))) {
      const items = await query(queries.select(page))
      return {
        ok: true,
        page,
        items
      };
    }
  }));

  return router;
}
