import React, { Component } from "react";
import { connect } from 'react-redux';
// import { identity } from "lodash";
import Field from "./Field.jsx";
import { CHANGE, submitAuth } from "../actions.jsx";

class Auth extends Component {
  change(e) {
    return this.props.dispatch({
      type: CHANGE,
      name: e.target.getAttribute("name"),
      value: e.target.value
    })
  }

  render() {
    const {values, errors} = this.props;
    return (
      <form>
        <Field error={errors.username}>
          <input name="username"
            placeholder="Username"
            value={values.username}
            onChange={e => this.change(e)} />
        </Field>
        <Field error={errors.password}>
          <input name="password"
            placeholder="Password"
            type="password"
            value={values.password}
            onChange={e => this.change(e)} />
        </Field>
        <button type="button" onClick={() => submitAuth(this.props.dispatch, values)}>Submit</button>
      </form>
    )
  }
}

export default connect(s => s.auth)(Auth);
