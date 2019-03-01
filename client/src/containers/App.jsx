import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { identity } from "lodash";
import Employees from "../components/Employees.jsx";
import React, { Component } from "react";

const Go = () => <Link to="/employees">Employees</Link>

class App extends Component {
  render() {
    return (<Router>
      <div>
        <div>Header</div>
        <div>
          <Route path="/links" exact component={Go} />
          <Route path="/employees" component={Employees} />
        </div>
      </div>
    </Router>)
  }
}

export default connect(identity)(App);
