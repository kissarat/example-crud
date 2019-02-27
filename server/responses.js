const _ = require("lodash");

const isProduction = "production" === process.env.NODE_ENV;

const explainedFields = ["message", "code", "status", "statusCode"];
if ("production" !== process.env.NODE_ENV) {
  explainedFields.push("stack");
}

function explain(error) {
  return _.pick(error, explainedFields);
}

module.exports = {
  explain,

  check(res, error) {
    if (error) {
      res.status(400)
        .json({
          ok: false,
          error
        })
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
          .json({
            ok: false,
            error: explain(error)
          })
      }
    }
  },

  modified(res, r) {
    const ok = r.affectedRows > 0;
    if (!ok) {
      res.status(404);
    }
    if (isProduction) {
      res.json({ok})
    }
    else {
      r.ok = ok;
      res.json(r);
    }
  }
}
