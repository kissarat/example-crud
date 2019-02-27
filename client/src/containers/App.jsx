import React, {Component} from "react";
import { connect } from 'react-redux';
import {identity} from "lodash";

class App extends Component {
  render() {
    return <div>
      <h1>Company</h1>
      <p>This is Redux application</p>
    </div>
  }
}

export default connect(identity)(App);
