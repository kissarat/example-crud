const { check, caught, modified } = require("../responses");
const { promisify } = require("util");
const crypto = require("crypto");
const express = require("express");
const query = require("../query");
const validate = require("../validate");
const authenticated = require("../authenticated");

const randomBytes = promisify(crypto.randomBytes);
const INVALID_LOGIN_RESPONSE = { ok: false, error: { message: "Invalid login or password" } };

function credentials(req, res, next) {
  if (check(res, validate.authentication(req.body))) {
    next();
  }
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function findUser(username) {
  const [user] = await query("select * from tblUsers where usrName = ? limit 1", [username]);
  return user;
}

async function generateToken(user_id) {
  const token = (await randomBytes(48)).toString("hex");
  await query("insert tblToken(tknID, tkn_usrID) values (?, ?)", [token, user_id]);
  return {
    ok: true,
    token
  };
}

module.exports = function () {
  const router = new express.Router();

  router.post("/register", credentials, caught(async function (req) {
    const user = await findUser(req.body.username);
    if (user) {
      return {
        ok: false,
        error: validate.invalid("username", "User already registered")
      };
    }
    const r = await query("insert tblUsers(usrName, usrPassword) values (?, ?)", [
      req.body.username,
      hashPassword(req.body.password),
    ]);
    return generateToken(r.insertId);
  }));

  router.post("/login", credentials, caught(async function (req) {
    const [user] = await query("select * from tblUsers where usrName = ? limit 1", [req.body.username]);
    if (!user) {
      return INVALID_LOGIN_RESPONSE;
    }
    if (hashPassword(req.body.password) !== user.usrPassword) {
      return INVALID_LOGIN_RESPONSE;
    }
    return generateToken(user.usrID);
  }));

  router.post("/logout", authenticated, caught(async function (req, res) {
    const r = await query("delete from tblToken where tknID = ?", [req.user.tknID]);
    modified(res, r);
  }));

  return router;
}
