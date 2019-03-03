import { combineReducers } from "redux";
import {
  REQUEST_EMPLOYEES,
  RECEIVE_EMPLOYEES,
  CHANGE_CREDENTIAL,
  SUBMIT_AUTH,
  INVALID_CREDENTIAL,
  CHANGE_AUTH_MODE
} from "./actions.jsx";

const employeesInitial = {
  page: {
    skip: 0,
    limit: 10,
    search: ""
  },
  items: [],
  busy: false
};

function employees(state = employeesInitial, action) {
  switch (action.type) {
    case REQUEST_EMPLOYEES:
      return {
        ...state,
        busy: true
      };
    case RECEIVE_EMPLOYEES:
      return {
        ...state,
        page: action.page,
        items: action.items,
        busy: false
      };
    default:
      return state;
  }
}

const authInitial = {
  values: { username: "", password: "" },
  errors: {},
  isSignup: false
};

function auth(state = authInitial, action) {
  switch (action.type) {
    case CHANGE_CREDENTIAL:
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value
        }
      };
    case INVALID_CREDENTIAL:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.error.name || "summary"]: action.error.message
        }
      };
    case SUBMIT_AUTH:
      return {
        ...state,
        errors: {}
      };
    case CHANGE_AUTH_MODE:
      return {
        ...state,
        isSignup: action.value
      };
    default:
      return state;
  }
}

export default combineReducers({
  employees,
  auth
});
