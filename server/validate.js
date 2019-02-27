const config = require("../config");

if (!config.pagination) {
  config.pagination = {};
}

Object.assign(config.pagination, {
  skip: 0,
  limit: 10
})

function invalid(name, message = `Value of ${name} is invalid`) {
  return { name, message }
}

function inArray(values, name, defaultValue, array) {
  const v = values[name];
  if (!v) {
    values[name] = defaultValue;
  }
  else if (array.indexOf(v) < 0) {
    const joined = array.map(item => `'${item}'`).join(",");
    return invalid(name, `Value of ${name} can be ${joined}`);
  }
}

function string(values, name) {
  if ("string" === typeof values[name]) {
    values[name] = values[name].trim();
    if (!values[name]) {
      return invalid(name);
    }
  }
  else {
    return invalid(name);
  }
}

const validate = {
  invalid,

  find(values) {
    values.skip = values.skip ? +values.skip : config.pagination.skip;
    values.limit = values.limit ? +values.limit : config.pagination.limit;
    values.total = +values.total > 0;
    let error;

    if (error = inArray(values, "sort", "empID", ["empID", "empName", "empActive"])) {
      return error;
    }

    if (error = inArray(values, "order", "asc", ["asc", "desc"])) {
      return error;
    }

    if (!(Number.isInteger(values.skip) && values.skip >= 0)) {
      return invalid("skip");
    }

    if (!(Number.isInteger(values.limit) && values.limit > 0)) {
      return invalid("limit");
    }
  },

  create(values) {
    let error;
    if (error = string(values, "empName")) {
      return error;
    }

    if ("boolean" !== typeof values.empActive) {
      return invalid("empActive");
    }

    if (!(Number.isInteger(values.emp_dpID) && values.emp_dpID >= 0)) {
      return invalid("emp_dpID");
    }
  }
}

module.exports = validate;
