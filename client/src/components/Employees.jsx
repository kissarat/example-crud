import React, { Component } from "react";
import { connect } from 'react-redux';
import { identity } from "lodash";
import { fetchEmployees } from "../actions.jsx";

function* getPages(limit, total) {
  const last = Math.ceil(total / limit);
  for (let i = 0; i < last; i++) {
    yield i + 1;
  }
}

class Employees extends Component {
  componentDidMount() {
    fetchEmployees(this.props.dispatch, this.props.employees.page);
  }

  go(page) {
    fetchEmployees(this.props.dispatch, {
      ...this.props.employees.page,
      ...page
    })
  }

  relativePage(page) {
    const { skip, limit } = this.props.employees.page;
    return this.go({
      skip: skip + (page > 0 ? 1 : -1) * limit
    })
  }

  changePage(page) {
    return this.go({
      skip: (page - 1) * this.props.employees.page.limit
    })
  }

  _pagination() {
    const { limit, total } = this.props.employees.page;
    const pages = total > 0 ? Array.from(getPages(limit, total))
      .map(page => <span key={page} onClick={() => this.changePage(page)}>{page}</span>) : [];
    return <div className="pagination">
      <span onClick={() => this.relativePage(-1)}>&lt;</span>
      {pages}
      <span onClick={() => this.relativePage(1)}>&gt;</span>
    </div>;
  }

  _rows() {
    return this.props.employees.items.map(item => <tr key={item.empID}>
      <td>{item.empID}</td>
      <td>{item.empName}</td>
      <td>{item.empActive ? "Yes" : "No"}</td>
      <td>{item.dpName}</td>
    </tr>);
  }

  render() {
    return <div>
      {this._pagination()}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Active</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {this._rows()}
        </tbody>
      </table>
    </div>
  }
}

export default connect(identity)(Employees);
