import React, { Component } from "react";
import { connect } from "react-redux";
import Field from "./Field.jsx";
import axios from "../axios.jsx";
import {
  CHANGE_EMPLOYEE,
  fetchSingleEmployee,
  submitEmployee
} from "../actions.jsx";

class EditEmployee extends Component {
  async componentDidMount() {
    fetchSingleEmployee(this.props.dispatch, this.props.match.params.id);
    const { data } = await axios.get("/employee/departments");
    if (data.ok) {
      this.setState({ departments: data.items });
    }
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

  _departments() {
    if (this.state && this.state.departments) {
      const items = this.state.departments.map(item => (
        <option key={item.dpID} value={item.dpID}>
          {item.dpName}
        </option>
      ));
      return (
        <label className="field">
          Department:&nbsp;
          <select value={this.props.values.dpID}>{items}</select>
        </label>
      );
    }
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
        {this._departments()}
        <label className="field">
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
