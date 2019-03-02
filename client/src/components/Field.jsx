import React, { Component } from "react";

class Field extends Component {
  render() {
    const { children, error } = this.props;
    return <div className="field">
      {children}
      {error ? <div className="error">{error}</div> : null}
    </div>
  }
}

export default Field;
