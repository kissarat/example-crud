const express = require("express");
const validate = require("../validate");
const _ = require("lodash");
const { check, caught, modified } = require("../responses");
const query = require("../query");
const authenticated = require("../authenticated");

const DEPARTMENTS_TABLE_NAME = "tblDepartments";
const EMPLOYEES_TABLE_NAME = "tblEmployees";

const sortedKeys = {
  tblEmployees: ["empName", "empActive", "emp_dpID"]
};
const EMPLOYEES_FIELDS = sortedKeys.tblEmployees.join(",");
const EMPLOYEES_SET_FIELDS = sortedKeys.tblEmployees
  .map(field => field + " = ?")
  .join(",");
const EMPLOYEES_PLACEHOLDERS = sortedKeys.tblEmployees.map(() => "?").join(",");

const SEARCH_WHERE = " where empName like ? ";

const queries = {
  one: `select * from ${EMPLOYEES_TABLE_NAME} join ${DEPARTMENTS_TABLE_NAME} on emp_dpID = dpID where empID = ? limit 1`,
  select: (fields = "*", where = "") =>
    `select ${fields} from ${EMPLOYEES_TABLE_NAME} join ${DEPARTMENTS_TABLE_NAME} on emp_dpID = dpID ` +
    where,
  sort: ({ sort, order }, fields = "*", where = "") =>
    queries.select(fields, where) + ` order by ${sort} ${order} limit ?, ?`,
  insert: `insert into ${EMPLOYEES_TABLE_NAME} (${EMPLOYEES_FIELDS}) values (${EMPLOYEES_PLACEHOLDERS})`,
  update: `update ${EMPLOYEES_TABLE_NAME} set ${EMPLOYEES_SET_FIELDS} where empID = ?`,
  delete: `delete from ${EMPLOYEES_TABLE_NAME} where empID = ?`
};

function object2array(object, keys) {
  const array = [];
  for (const key of keys) {
    array.push(object[key]);
  }
  return array;
}

function validateID(req, res, next) {
  req.params.id = +req.params.id;
  if (req.params.id > 0) {
    next();
  } else {
    res.status(400).json(validate.invalid("id"));
  }
}

function generateEdit(execute) {
  return async function(req, res) {
    if (check(res, validate.edit(req.body))) {
      const r = await execute(req);
      modified(res, r);
    }
  };
}

const create = generateEdit(req =>
  query(queries.insert, object2array(req.body, sortedKeys.tblEmployees))
);

const update = generateEdit(req =>
  query(queries.update, [
    ...object2array(req.body, sortedKeys.tblEmployees),
    req.params.id
  ])
);

module.exports = function() {
  const router = new express.Router();

  router.get(
    "/:id",
    validateID,
    caught(async function(req, res) {
      const [item] = await query(queries.one, [req.params.id]);
      if (!item) {
        res.status(404);
      }
      return {
        ok: true,
        item
      };
    })
  );

  router.get(
    "/",
    authenticated,
    caught(async function(req, res) {
      const page = _.pick(
        req.query,
        "skip",
        "limit",
        "total",
        "sort",
        "order",
        "search"
      );
      if (check(res, validate.find(page))) {
        let items;
        let search;
        let where = "";
        if (page.search) {
          search =
            "%" +
            page.search
              .trim()
              .split(/\s+/)
              .join("%") +
            "%";
          where = SEARCH_WHERE;
        }
        const params = search ? [search] : [];
        items = await query(
          queries.sort(page, "*", where),
          params.concat([page.skip, page.limit])
        );
        const r = {
          ok: true,
          page: _.pick(page, "skip", "limit", "sort", "order"),
          items
        };
        if (page.total) {
          const [{ total }] = await query(
            queries.select("count(*) as total", where),
            params
          );
          r.page.total = total;
        }
        return r;
      }
    })
  );

  router.post("/", authenticated, caught(create));

  router.put("/:id", validateID, authenticated, caught(update));

  router.delete(
    "/:id",
    validateID,
    authenticated,
    caught(async function(req, res) {
      const r = await query(queries.delete, [req.params.id]);
      modified(res, r);
    })
  );

  return router;
};
