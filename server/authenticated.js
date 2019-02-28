const query = require("./query");
const { fail, explain } = require("./responses");

const QUERY = "select usrName, tknID from tblUsers join tblToken on usrID = tkn_usrID where tknID = ?";

module.exports = async function (req, res, next) {
  const m = /\w+$/.exec(req.headers.authentication || '');
  if (!m) {
    return void res.status(401).end();
  }
  try {
    const [user] = await query(QUERY, [m[0]]);
    if (user) {
      req.user = user;
      next();
    }
    else {
      res.status(401).end();
    }
  }
  catch (err) {
    res.status(500)
      .json(fail(explain(err)));
  }
}
