import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchEmployees } from "../actions.jsx";
import axios from "../axios.jsx";
import { Link } from "react-router-dom";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [5, DEFAULT_PAGE_SIZE, 20, 50, 100, 200, 500];
const UNSORTED = "\u2b0d";
const ASC = "\u25b2";
const DESC = "\u25bc";

class Employees extends Component {
  constructor(...args) {
    super(...args);
    this.fetchEmployees = (...args) =>
      fetchEmployees(this.props.dispatch, ...args);
  }

  componentDidMount() {
    this.fetchEmployees(this.props.page);
  }

  /**
   * Changing state for page
   * @param {object} page
   */
  go(page) {
    this.fetchEmployees({
      ...this.props.page,
      ...page
    });
  }

  /**
   * Next or previous page changing
   * @param {int} page
   */
  relativePage(page) {
    const { skip, limit } = this.props.page;
    return this.go({
      skip: skip + (page > 0 ? 1 : -1) * limit
    });
  }

  /**
   * Change page
   * @param {int} page
   */
  changePage(page) {
    return this.go({
      skip: (page - 1) * this.props.page.limit
    });
  }

  /**
   * Employee remove
   * @param {int} id
   */
  async remove(id) {
    const { data } = await axios.delete("/employee/" + id);
    if (data.ok) {
      return this.fetchEmployees();
    }
  }

  sort(name) {
    this.fetchEmployees({
      ...this.props.page,
      sort: name,
      order:
        name === this.props.page.sort
          ? "asc" === this.props.page.order
            ? "desc"
            : "asc"
          : "asc"
    });
  }

  /**
   * Menu for page choosing
   */
  _pagination() {
    const { limit, total, skip } = this.props.page;
    const get = s => Math.max(1, Math.ceil(s / limit));
    const last = get(total);
    const numbers = [];
    for (let i = 0; i < last; i++) {
      numbers.push(i + 1);
    }
    const current = get(skip + limit);
    const pages =
      total > 0
        ? numbers.map(page => (
            <span
              key={page}
              onClick={() => this.changePage(page)}
              className={current === page ? "active" : ""}
            >
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

  /**
   * Size of page
   */
  _limit() {
    const items = PAGE_SIZES.map(size => (
      <option key={size} value={size}>
        {size}
      </option>
    ));
    return (
      <select
        value={this.props.page.limit}
        onChange={e =>
          this.fetchEmployees({
            ...this.props.page,
            limit: +e.target.value || DEFAULT_PAGE_SIZE
          })
        }
      >
        {items}
      </select>
    );
  }

  _search() {
    return (
      <input
        type="search"
        placeholder="Search..."
        onChange={e =>
          this.fetchEmployees({
            ...this.props.page,
            search: e.target.value
          })
        }
      />
    );
  }

  _order(name) {
    const char =
      name === this.props.page.sort
        ? "asc" === this.props.page.order
          ? ASC
          : DESC
        : UNSORTED;
    return <span>{char}</span>;
  }

  _headers() {
    return (
      <tr>
        <th />
        <th />
        <th className="sortable" onClick={() => this.sort("empID")}>
          ID {this._order("empID")}
        </th>
        <th className="sortable" onClick={() => this.sort("empName")}>
          Name {this._order("empName")}
        </th>
        <th className="sortable" onClick={() => this.sort("empActive")}>
          Active {this._order("empActive")}
        </th>
        <th className="sortable" onClick={() => this.sort("emp_dpID")}>
          Department {this._order("emp_dpID")}
        </th>
        <th />
      </tr>
    );
  }

  /**
   * Renders rows of table
   */
  _rows() {
    return this.props.items.map(item => (
      <tr key={item.empID}>
        <td>
          <Link to={"/employee/view/" + item.empID}>View</Link>
        </td>
        <td>
          <Link to={"/employee/edit/" + item.empID}>Edit</Link>
        </td>
        <td>{item.empID}</td>
        <td>{item.empName}</td>
        <td>{item.empActive ? "Yes" : "No"}</td>
        <td>{item.dpName}</td>
        <td className="action" onClick={() => this.remove(item.empID)}>
          Delete
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <div className="employee list">
        <h2>Employees</h2>
        {this._search()}
        <span>
          {this._limit()}
          &nbsp;items per page
        </span>
        {this._pagination()}
        <Link to="/employee/create">Create</Link>
        <table>
          <thead>{this._headers()}</thead>
          <tbody>{this._rows()}</tbody>
        </table>
      </div>
    );
  }
}

export default connect(o => o.employees)(Employees);
