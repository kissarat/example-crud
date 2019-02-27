const main = require("../server/main");
const axios = require("axios");
const config = require("../config");

async function setup() {
  module.exports.server = await main();
  const baseURL = `http://localhost:${config.port}/api`;
  // console.log(baseURL);
  module.exports.axios = axios.create({baseURL});
}

module.exports = {
  setup
};
