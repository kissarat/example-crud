import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEmployees } from "../actions.jsx";
import axios from "../axios.jsx";

class Employees extends Component {
  componentDidMount() {
    fetchEmployees(this.props.dispatch, this.props.page);
  }

  go(page) {
    fetchEmployees(this.props.dispatch, {
      ...this.props.page,
      ...page
    });
  }

  relativePage(page) {
    const { skip, limit } = this.props.page;
    return this.go({
      skip: skip + (page > 0 ? 1 : -1) * limit
    });
  }

  changePage(page) {
    return this.go({
      skip: (page - 1) * this.props.page.limit
    });
  }

  async remove(id) {
    const {data} = await axios.delete("/employee/" + id);
    if (data.ok) {
      return fetchEmployees(this.props.dispatch);
    }
  }

  _pagination() {
    const { limit, total, skip } = this.props.page;
    const get = s => Math.max(1, Math.ceil(s / limit))
    const last = get(total);
    const numbers = [];
    for (let i = 0; i < last; i++) {
      numbers.push(i + 1);
    }
    const current = get(skip + limit);
    const pages =
      total > 0
        ? numbers.map(page => (
            <span key={page}
            onClick={() => this.changePage(page)}
            className={current === page ? "active" : ""}>
              {page}
            </span>
          ))
        : [];
    return (
      <div className={"pagination " + (this.props.busy ? "busy" : "")}>
        <span onClick={() => this.relativePage(-1)}>&lt;</span>
        {pages}
        <span onClick={() => this.relativePage(1)}>&gt;</span>
      </div>
    );
  }

  _rows() {
    return this.props.items.map(item => (
      <tr key={item.empID}>
        <td>{item.empID}</td>
        <td>{item.empName}</td>
        <td>{item.empActive ? "Yes" : "No"}</td>
        <td>{item.dpName}</td>
        <td className="action" onClick={() => this.remove(item.empID)}>Delete</td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        {this._pagination()}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Active</th>
              <th>Department</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this._rows()}</tbody>
        </table>
      </div>
    );
  }
}

export default connect(o => o.employees)(Employees);
