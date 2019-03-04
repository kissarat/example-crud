import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { identity } from "lodash";
import Auth from "../components/Auth.jsx";
import axios from "../axios.jsx";
import EditEmployee from "../components/EditEmployee.jsx";
import EmployeesList from "../components/EmployeesList.jsx";
import React, { Component } from "react";
import ViewEmployee from "../components/ViewEmployee.jsx";

class App extends Component {
  async logout() {
    const { data } = await axios.post("/auth/logout");
    if (data.ok) {
      axios.token = null;
      // this.props.history.push("/auth");
      location.href = "/auth";
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
