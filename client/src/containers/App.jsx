import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { identity } from "lodash";
import ViewEmployee from "../components/ViewEmployee.jsx";
import EditEmployee from "../components/EditEmployee.jsx";
import Employees from "../components/Employees.jsx";
import Auth from "../components/Auth.jsx";
import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div>Header</div>
          <div>
            <Route path="/auth" exact component={Auth} />
            <Route path="/employee/view/:id" component={ViewEmployee} />
            <Route path="/employee/create" component={EditEmployee} />
            <Route path="/employee/edit/:id" component={EditEmployee} />
            <Route path="/employees" component={Employees} />
          </div>
        </div>
      </Router>
    )
  }
}

export default connect(identity)(App);
