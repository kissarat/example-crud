const express = require("express");

module.exports = function(options) {
  const controllersName = ["auth", "employee", "department"];
  const router = new express.Router();
  for (const controllerName of controllersName) {
    const postfix = "/" + controllerName;
    router.use(postfix, require("." + postfix)(options));
  }
  return router;
}
