const express = require("express");
const validate = require("../validate");
const _ = require("lodash");
const { check, caught, modified } = require("../responses");
const query = require("../query");

const queries = {
  select: (fields = "*") => `select ${fields} from tblEmployees join tblDepartments on emp_dpID = dpID`,
  sort: ({sort, order}) => queries.select() + ` order by ${sort} ${order} limit ?, ?`,
  insert: `insert into tblEmployees(empName, empActive, emp_dpID) values (?, ?, ?)`
}

const sortedKeys = {
  tblEmployees: ["empName", "empActive", "emp_dpID"]
}

function object2array(object, keys) {
  const array = [];
  for(const key of keys) {
    array.push(object[key]);
  }
  return array;
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

  router.post("/", caught(async function (req, res) {
    const data = req.body;
    if (check(res, validate.create(data))) {
      const r = await query(queries.insert, object2array(data, sortedKeys.tblEmployees));
      return modified(r);
    }
  }));

  return router;
}
