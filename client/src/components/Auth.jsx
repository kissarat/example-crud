import { CHANGE_CREDENTIAL, CHANGE_AUTH_MODE, submitAuth } from "../actions.jsx";
import { connect } from "react-redux";
import Field from "./Field.jsx";
import React, { Component } from "react";

class Auth extends Component {
  change(e) {
    return this.props.dispatch({
      type: CHANGE_CREDENTIAL,
      name: e.target.getAttribute("name"),
      value: e.target.value
    });
  }

  render() {
    const { values, errors, isSignup = false } = this.props;
    return (
      <form>
        <h2>Authentication</h2>
        {errors.summary ? <div className="error">{errors.summary}</div> : null}
        <Field error={errors.username}>
          <input
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={e => this.change(e)}
          />
        </Field>
        <Field error={errors.password}>
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={values.password}
            onChange={e => this.change(e)}
          />
        </Field>
        <label>
          <input
            type="checkbox"
            checked={isSignup}
            onChange={e =>
              this.props.dispatch({
                type: CHANGE_AUTH_MODE,
                value: e.target.checked
              })
            }
          />
          register
        </label>
        <div className="controls">
          <button
            type="button"
            onClick={() => submitAuth(this.props.dispatch, this.props)}
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default connect(s => s.auth)(Auth);
