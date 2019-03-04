import { connect } from "react-redux";
import { fetchSingleEmployee } from "../actions.jsx";
import { Link } from "react-router-dom";
import React, { Component } from "react";

class ViewEmployee extends Component {
  componentDidMount() {
    fetchSingleEmployee(this.props.dispatch, this.props.match.params.id);
  }

  componentWillReceiveProps(props) {
    if (props.match.params.id !== this.props.match.params.id) {
      fetchSingleEmployee(this.props.dispatch, props.match.params.id);
    }
  }

  render() {
    const { values, errors } = this.props;
    return (
      <div className="employee view">
        <Link to="/employees">Employees</Link>
        <h2>Employee #{values.empID}</h2>
        {errors.summary ? <div className="error">{errors.summary}</div> : null}
        <div>Name: {values.empName}</div>
        <div>Active: {values.empActive ? "Yes" : "No"}</div>
        <div>Department: {values.dpName}</div>
      </div>
    );
  }
}

export default connect(s => s.singleEmployee)(ViewEmployee);
