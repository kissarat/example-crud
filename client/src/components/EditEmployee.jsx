import React, { Component } from "react";
import { connect } from "react-redux";
import Field from "./Field.jsx";
import {
  CHANGE_EMPLOYEE,
  CLEAR_EMPLOYEE,
  fetchSingleEmployee,
  submitEmployee
} from "../actions.jsx";

class EditEmployee extends Component {
  componentDidMount() {
    fetchSingleEmployee(this.props.dispatch, this.props.match.params.id);
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      fetchSingleEmployee(this.props.dispatch, props.match.params.id);
    }
  }

  change(e, value) {
    return this.props.dispatch({
      type: CHANGE_EMPLOYEE,
      name: e.target.getAttribute("name"),
      value
    });
  }

  render() {
    const { values, errors } = this.props;
    const id = this.props.match.params.id;
    return (
      <form className="employee edit">
        <h1>{id ? `Edit Employee #${id}` : "Create Employee"}</h1>
        {errors.summary ? <div className="error">{errors.summary}</div> : null}
        <Field error={errors.empName}>
          <input
            name="empName"
            placeholder="Name"
            value={values.empName}
            onChange={e => this.change(e, e.target.value)}
          />
        </Field>
        <label>
          <input
            type="checkbox"
            name="empActive"
            checked={values.empActive}
            onChange={e => this.change(e, e.target.checked)}
          />
          active
        </label>
        <div className="controls">
          <button
            type="button"
            disabled={this.props.busy}
            onClick={() => submitEmployee(this.props.dispatch, this.props)}
          >
            {id ? "Save" : "Create"}
          </button>
        </div>
      </form>
    );
  }
}

export default connect(s => s.singleEmployee)(EditEmployee);
