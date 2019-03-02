import axios from "./axios.jsx";
import _ from "lodash";
import validate from "../../server/validate"

export const REQUEST_EMPLOYEES = "REQUEST_EMPLOYEES";
export const RECEIVE_EMPLOYEES = "RECEIVE_EMPLOYEES";
export const CHANGE = "CHANGE";
export const INVALID = "INVALID";
export const SUBMIT = "SUBMIT";

// const action = name => type => item => ({
//   type,
//   [name]: item
// });
// const employeeAction = action("employees");
// export const requestEmployees = employeeAction(REQUEST_EMPLOYEES);
// export const receiveEmployees = employeeAction(RECEIVE_EMPLOYEES);

export const fetchEmployees = async (dispatch, page) => {
  dispatch({type: REQUEST_EMPLOYEES});
  const { data } = await axios.get(`/employee?skip=${page.skip}&limit=${page.limit}&total=1`);
  if (data.ok) {
    dispatch({
      type: RECEIVE_EMPLOYEES,
      page: _.pick(data.page, "skip", "limit", "total"),
      items: data.items
    });
  }
}

export const submitAuth = async (dispatch, values) => {
  const error = validate.authentication(values);
  if (error) {
    dispatch({
      type: INVALID,
      error
    });
  }
  else {
    dispatch({type: SUBMIT})
    console.log("Submitted");
  }
}
