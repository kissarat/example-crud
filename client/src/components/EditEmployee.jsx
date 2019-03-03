import React, { Component } from "react";
import { connect } from "react-redux";
import Field from "./Field.jsx";
import { CHANGE_EMPLOYEE } from "../actions.jsx";

class EditEmployee extends Component {
  load(id) {
    if (id) {
    } else {
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
    return (
      <form>
        {errors.summary ? <div className="error">{errors.summary}</div> : null}
        <Field error={errors.empName}>
          <input
            name="username"
            placeholder="Username"
            value={values.empName}
            onChange={e => this.change(e, e.target.value)}
          />
        </Field>
        <label>
          <input
            type="checkbox"
            checked={values.empActive}
            onChange={e => this.change(e, e.target.checked)}
          />
          active
        </label>
        <div className="controls">
          <button
            type="button"
            onClick={() => submitAuth(this.props.dispatch, this.props)}
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default connect(s => s.auth)(EditEmployee);
