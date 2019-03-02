import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { identity } from "lodash";
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
            <Route path="/employees" component={Employees} />
          </div>
        </div>
      </Router>
    )
  }
}

export default connect(identity)(App);
