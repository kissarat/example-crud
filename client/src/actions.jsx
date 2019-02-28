import axios from "./axios.jsx";
import _ from "lodash";

export const REQUEST_EMPLOYEES = "REQUEST_EMPLOYEES";
export const RECEIVE_EMPLOYEES = "RECEIVE_EMPLOYEES";

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
