import { combineReducers } from 'redux';
import { REQUEST_EMPLOYEES, RECEIVE_EMPLOYEES } from "./actions.jsx";

const initialState = {
  page: {
    skip: 0,
    limit: 10
  },
  items: []
}

function employees(state = initialState, action) {
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

export default combineReducers({
  employees
});
