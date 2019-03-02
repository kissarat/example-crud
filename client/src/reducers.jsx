import { combineReducers } from 'redux';
import { REQUEST_EMPLOYEES, RECEIVE_EMPLOYEES, CHANGE, SUBMIT, INVALID } from "./actions.jsx";

const employeesInitialState = {
  page: {
    skip: 0,
    limit: 10
  },
  items: []
}

const createForm = values => ({
  errors: {},
  values
})

function employees(state = employeesInitialState, action) {
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
      }
    default:
      return state;
  }
}

function auth(state = createForm({ username: '', password: '' }), action) {
  switch (action.type) {
    case CHANGE:
      return {
        errors: state.errors,
        values: {
          ...state.values,
          [action.name]: action.value
        }
      };
    case INVALID:
      return {
        errors: {
          ...state.errors,
          [action.error.name]: action.error.message
        },
        values: state.values
      };
    case SUBMIT:
      return {
        errors: {},
        values: state.values
      }
    default:
      return state;
  }
}

export default combineReducers({
  employees,
  auth
});
