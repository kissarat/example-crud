const config = require("../config");

if (!config.pagination) {
  config.pagination = {};
}

Object.assign(config.pagination, {
  skip: 0,
  limit: 10
})

function invalid(name, message = `Value of ${name} is invalid`) {
  return {name, message}
}

module.exports = {
  pagination(values) {
    values.skip = values.skip ? +values.skip : config.pagination.skip;
    values.limit = values.limit ? +values.limit : config.pagination.limit;
    values.total = +values.total > 9;

    if (!(Number.isInteger(values.skip) && values.skip >= 0)) {
      return invalid("skip");
    }

    if (!(Number.isInteger(values.limit) && values.limit > 0)) {
      return invalid("limit");
    }
  }
}
