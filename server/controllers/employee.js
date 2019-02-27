const Repository = require("../repository");
const express = require("express");
const validate = require("../validate");
const _ = require("lodash");
const { check, caught } = require("../responses");
const query = require("../query");

const queries = {
  select: (fields = "*") => `select ${fields} from tblEmployees join tblDepartments on emp_dpID = dpID`,
  sort: ({sort, order}) => queries.select() + ` order by ${sort} ${order} limit ?, ?`
}

module.exports = function () {
  const router = new express.Router();

  router.get("/", caught(async function (req, res) {
    const page = _.pick(req.query, "skip", "limit", "total", "sort", "order");
    if (check(res, validate.find(page))) {
      const items = await query(queries.sort(page), [page.skip, page.limit]);
      const r = {
        ok: true,
        page,
        items
      };
      if (page.total) {
        const [{total}] = await query(queries.select("count(*) as total"));
        r.total = total;
      }
      return r;
    }
  }));

  return router;
}
