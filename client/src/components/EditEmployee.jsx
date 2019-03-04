import React, { Component } from "react";
import { connect } from "react-redux";
import Field from "./Field.jsx";
import axios from "../axios.jsx";
import validate from "../../../server/validate";
import {
  CHANGE_EMPLOYEE,
  fetchSingleEmployee,
  submitEmployee
} from "../actions.jsx";
import { Link } from "react-router-dom";

class EditEmployee extends Component {
  constructor(...args) {
    super(...args);
    this.state = { isNewDepartment: false, dpName: "" };
  }

  componentDidMount() {
    fetchSingleEmployee(this.props.dispatch, this.props.match.params.id);
    this.loadDepartments();
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      fetchSingleEmployee(this.props.dispatch, props.match.params.id);
    }
  }

  async loadDepartments() {
    const { data } = await axios.get("/department");
    if (data.ok) {
      if (!(this.props.values.emp_dpID > 0) && data.items.length > 0) {
        this.props.dispatch({
          type: CHANGE_EMPLOYEE,
          name: "emp_dpID",
          value: data.items[0].dpID
        });
      }
      this.setState({ departments: data.items });
    }
  }

  change(e, value) {
    return this.props.dispatch({
      type: CHANGE_EMPLOYEE,
      name: e.target.getAttribute("name"),
      value
    });
  }

  async createDepartment() {
    const department = {
      dpName: this.state.dpName
    };
    const error = validate.department(department);
    if (error) {
      return void this.setState({ error });
    }
    const { data } = await axios.post("/department", department);
    if (data.ok) {
      this.setState({ isNewDepartment: false, error: null });
      this.props.dispatch({
        type: CHANGE_EMPLOYEE,
        name: "emp_dpID",
        value: data.id
      });
      this.loadDepartments();
    } else if (data.error) {
      this.setState({ error: data.error });
    }
  }

  _departments() {
    if (this.state.departments) {
      let input;
      if (this.state.isNewDepartment) {
        input = (
          <input
            placeholder="Name"
            value={this.state.dpName}
            onChange={e => this.setState({ dpName: e.target.value })}
          />
        );
      } else {
        const items = this.state.departments.map(item => (
          <option key={item.dpID} value={item.dpID}>
            {item.dpName}
          </option>
        ));
        input = (
          <select
            value={this.props.values.emp_dpID}
            onChange={e => this.change(e, e.target.value)}
          >
            {items}
          </select>
        );
      }
      const onPlus = () =>
        this.state.isNewDepartment
          ? this.createDepartment()
          : this.setState({ isNewDepartment: true });
      return (
        <label className="field">
          Department:&nbsp;{input}
          <button type="button" onClick={onPlus}>
            +
          </button>
          {this.state.error ? (
            <div className="error">{this.state.error.message}</div>
          ) : null}
        </label>
      );
    }
  }

  render() {
    const { values, errors } = this.props;
    const id = this.props.match.params.id;
    return (
      <form className="employee edit">
        <Link to="/employees">Employees</Link>
        <h2>{id ? `Edit Employee #${id}` : "Create Employee"}</h2>
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
        <Field error={errors.empActive}>
          <label>
            <input
              type="checkbox"
              name="empActive"
              checked={values.empActive}
              onChange={e => this.change(e, e.target.checked)}
            />
            active
          </label>
        </Field>
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
