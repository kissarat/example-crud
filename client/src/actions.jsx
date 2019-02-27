import axios from "./axios.jsx";

export const REQUEST_EMPLOYEES = "REQUEST_EMPLOYEES";
export const RECEIVE_EMPLOYEES = "RECEIVE_EMPLOYEES";

const action = name => type => item => ({
  type,
  [name]: item
});
const employeeAction = action("employees");
const requestEmployees = employeeAction(REQUEST_EMPLOYEES);
const receiveEmployees = employeeAction(RECEIVE_EMPLOYEES);

async function fetchEmployees(dispatch) {
  dispatch(requestEmployees([]));
  const { data } = await axios.get("/employee");
  if (data.ok) {
    dispatch(receiveEmployees(data.items));
  }
}
