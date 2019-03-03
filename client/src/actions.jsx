import axios from "./axios.jsx";
import _ from "lodash";
import validate from "../../server/validate";
import querystring from "auxiliary/querystring";

export const REQUEST_EMPLOYEES = "REQUEST_EMPLOYEES";
export const RECEIVE_EMPLOYEES = "RECEIVE_EMPLOYEES";
export const CHANGE = "CHANGE";
export const CHANGE_AUTH_MODE = "CHANGE_AUTH_MODE";
export const INVALID = "INVALID";
export const SUBMIT = "SUBMIT";

// const action = name => type => item => ({
//   type,
//   [name]: item
// });
// const employeeAction = action("employees");
// export const requestEmployees = employeeAction(REQUEST_EMPLOYEES);
// export const receiveEmployees = employeeAction(RECEIVE_EMPLOYEES);

export const fetchEmployees = async (
  dispatch,
  page = { skip: 0, limit: 10 }
) => {
  dispatch({ type: REQUEST_EMPLOYEES });
  const { data } = await axios.get(
    "/employee?" +
      querystring.stringify({
        ..._.pick(page, "skip", "limit"),
        total: 1
      })
  );
  if (data.ok) {
    dispatch({
      type: RECEIVE_EMPLOYEES,
      page: _.pick(data.page, "skip", "limit", "total"),
      items: data.items
    });
  }
};

export const submitAuth = async (dispatch, { values, history, isSignup }) => {
  const error = validate.authentication(values);
  const invalid = error =>
    dispatch({
      type: INVALID,
      error
    });
  if (error) {
    invalid(error);
  } else {
    dispatch({ type: SUBMIT });
    const { data } = await axios.post(
      "/auth/" + (isSignup ? "register" : "login"),
      values
    );
    if (data.ok) {
      localStorage.setItem(axios.AuthStorageKey, data.token);
      axios.defaults.headers.authorization = "Bearer " + data.token;
      fetchEmployees(dispatch);
      history.push("/employees");
    } else if (_.isObject(data.error)) {
      invalid(data.error);
    } else {
      console.error("Invalid response", data);
    }
  }
};
