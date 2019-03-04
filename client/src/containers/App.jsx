import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { identity } from "lodash";
import ViewEmployee from "../components/ViewEmployee.jsx";
import EditEmployee from "../components/EditEmployee.jsx";
import EmployeesList from "../components/EmployeesList.jsx";
import Auth from "../components/Auth.jsx";
import React, { Component } from "react";

class App extends Component {
  async logout() {
    const { data } = await axios.post("/auth/logout");
    if (data.ok) {
      this.props.history.push("/login");
    } else if (data.error) {
      alert(data.error.message);
    }
  }

  render() {
    return (
      <Router>
        <div>
          <button id="logout" type="button" onClick={() => this.logout()}>
            Logout
          </button>
          <h1>CRUD Example</h1>
          <div>
            <Route path="/auth" exact component={Auth} />
            <Route path="/employee/view/:id" component={ViewEmployee} />
            <Route path="/employee/create" component={EditEmployee} />
            <Route path="/employee/edit/:id" component={EditEmployee} />
            <Route path="/employees" component={EmployeesList} />
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(identity)(App);
