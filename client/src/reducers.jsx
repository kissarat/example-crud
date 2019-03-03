import { combineReducers } from "redux";
import {
  REQUEST_EMPLOYEES,
  RECEIVE_EMPLOYEES,
  CHANGE,
  SUBMIT,
  INVALID,
  CHANGE_AUTH_MODE
} from "./actions.jsx";

const employeesInitial = {
  page: {
    skip: 0,
    limit: 10
  },
  items: [],
  busy: false
};

function employees(state = employeesInitial, action) {
  switch (action.type) {
    case RECEIVE_EMPLOYEES:
      return {
        ...state,
        items: action.items,
        page: action.page,
        busy: false
      };
    case REQUEST_EMPLOYEES:
      return {
        ...state,
        busy: true
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
    case CHANGE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value
        }
      };
    case INVALID:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.error.name || "summary"]: action.error.message
        },
      };
    case SUBMIT:
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
