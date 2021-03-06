import _ from "lodash";
import axios from "./axios.jsx";
import querystring from "auxiliary/querystring";
import validate from "../../server/validate";

export const CHANGE_AUTH_MODE = "CHANGE_AUTH_MODE";
export const CHANGE_CREDENTIAL = "CHANGE_CREDENTIAL";
export const CHANGE_EMPLOYEE = "CHANGE_EMPLOYEE";
export const CHANGE_EMPLOYEE_LIMIT = "CHANGE_EMPLOYEE_LIMIT";
export const CLEAR_EMPLOYEE = "CLEAR_EMPLOYEE";
export const DELETE_EMPLOYEE = "DELETE_EMPLOYEE";
export const INVALID_CREDENTIAL = "INVALID_CREDENTIAL";
export const INVALID_EMPLOYEE = "INVALID_EMPLOYEE";
export const RECEIVE_EMPLOYEES = "RECEIVE_EMPLOYEES";
export const RECEIVE_SINGLE_EMPLOYEE = "RECEIVE_SINGLE_EMPLOYEE";
export const REQUEST_EMPLOYEES = "REQUEST_EMPLOYEES";
export const REQUEST_SINGLE_EMPLOYEE = "REQUEST_SINGLE_EMPLOYEE";
export const SUBMIT_AUTH = "SUBMIT_AUTH";
export const SUBMIT_EMPLOYEE = "SUBMIT_EMPLOYEE";

// const action = name => type => item => ({
//   type,
//   [name]: item
// });
// const employeeAction = action("employees");
// export const requestEmployees = employeeAction(REQUEST_EMPLOYEES);
// export const receiveEmployees = employeeAction(RECEIVE_EMPLOYEES);

const createPage = (sort = "empID", order = "asc") => ({
  skip: 0,
  limit: 10,
  search: "",
  sort,
  order
});

export const fetchEmployees = async (dispatch, page = createPage()) => {
  dispatch({ type: REQUEST_EMPLOYEES });
  const { data } = await axios.get(
    "/employee?" +
      querystring.stringify({
        ..._.pick(page, "skip", "limit", "sort", "order", "search"),
        total: 1
      })
  );
  if (data.ok) {
    dispatch({
      type: RECEIVE_EMPLOYEES,
      page: _.pick(data.page, "skip", "limit", "total", "sort", "order", "search"),
      items: data.items
    });
  }
};

export const fetchSingleEmployee = async (dispatch, id) => {
  if (id) {
    const showError = message =>
      dispatch({
        type: INVALID_EMPLOYEE,
        error: { message }
      });
    dispatch({ type: REQUEST_SINGLE_EMPLOYEE });
    const { data, status } = await axios.get(`/employee/${id}`);
    if (data.ok) {
      if (200 === status) {
        dispatch({
          type: RECEIVE_SINGLE_EMPLOYEE,
          item: data.item,
          departments: data.departments
        });
      } else {
        showError(`Employee with id = ${id} not found`);
      }
    } else {
      showError(data.message || "Unknown server error");
    }
  } else {
    dispatch({ type: CLEAR_EMPLOYEE });
  }
};

export const submitEmployee = async (dispatch, { values, history, match }) => {
  const error = validate.edit(values);
  if (error) {
    return void dispatch({ type: INVALID_EMPLOYEE, error });
  }
  dispatch({ type: SUBMIT_EMPLOYEE });
  const id = match.params.id;
  const { data } = await axios[id ? "put" : "post"](
    id ? "/employee/" + id : "/employee",
    values
  );
  if (data.ok) {
    history.push("/employees");
  } else {
    dispatch({
      type: INVALID_EMPLOYEE,
      error: data.error || { message: data.message || "Unknown server error" }
    });
  }
};

export const submitAuth = async (dispatch, { values, history, isSignup }) => {
  const error = validate.authentication(values);
  if (error) {
    return void dispatch({ type: INVALID_CREDENTIAL, error });
  }
  dispatch({ type: SUBMIT_AUTH });
  const { data } = await axios.post(
    "/auth/" + (isSignup ? "register" : "login"),
    values
  );
  if (data.ok) {
    axios.token = data.token;
    axios.defaults.headers.authorization = "Bearer " + data.token;
    fetchEmployees(dispatch);
    history.push("/employees");
  } else {
    dispatch({
      type: INVALID_CREDENTIAL,
      error: data.error || { message: data.message || "Unknown server error" }
    });
  }
};
