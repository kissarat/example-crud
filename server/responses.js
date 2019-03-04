const _ = require("lodash");

const isProduction = "production" === process.env.NODE_ENV;

const explainedFields = ["message", "code", "status", "statusCode"];
if ("production" !== process.env.NODE_ENV) {
  explainedFields.push("stack");
}

function explain(error) {
  error = _.pick(error, explainedFields);
  if ("string" === typeof error.stack) {
    error.stack = error.stack.split(/\s*\n\s*/)
  }
  return error;
}

function fail(error) {
  return {
    ok: false,
    error
  }
}

module.exports = {
  explain,
  fail,

  check(res, error) {
    if (error) {
      res.status(400)
        .json(fail(error))
      return false;
    }
    else {
      return true;
    }
  },

  caught(fun) {
    return async function (req, res) {
      try {
        const data = await fun(req, res);
        if (_.isObject(data)) {
          res.json(data);
        }
      }
      catch (error) {
        res.status(500)
          .json(fail(explain(error)))
      }
    }
  },

  modified(res, r) {
    const data = {
      ok: r.affectedRows > 0
    }
    if (r.insertId > 0) {
      data.id = r.insertId;
    }
    if (!data.ok) {
      res.status(404);
    }
    if (!isProduction) {
      Object.assign(data, r);
    }
    res.json(data);
  }
}
