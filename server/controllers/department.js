const { check, caught, modified, fail } = require("../responses");
const authenticated = require("../authenticated");
const query = require("../query");
const validate = require("../validate");
const express = require("express");

const queries = {
  select: "select * from tblDepartments order by dpName",
  insert: "insert into tblDepartments(dpName) values (?)",
  one: "select * from tblDepartments where dpName = ? limit 1"
};

module.exports = function() {
  const router = new express.Router();

  router.get(
    "/",
    authenticated,
    caught(async function() {
      const items = await query(queries.select);
      return { ok: true, items };
    })
  );

  router.post(
    "/",
    authenticated,
    caught(async function(req, res) {
      if (check(res, validate.department(req.body))) {
        const [department] = await query(queries.one, [req.body.dpName]);
        if (department) {
          return fail(validate.invalid("dpName", `Department with name "${req.body.dpName}" already exists`));
        }
        const r = await query(queries.insert, [req.body.dpName]);
        modified(res, r);
      }
    })
  );

  return router;
};
