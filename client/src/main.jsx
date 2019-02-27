import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { Provider } from "react-redux";

const middleware = [];
if ("production" !== process.env.NODE_ENV) {
  middleware.push(createLogger());
}

const store = createStore(
  applyMiddleware(...middleware)
);

const Index = () => {
  return <div>This is company website!</div>;
};

const app = <Provider store={store}>
  <Index />
</Provider>;

ReactDOM.render(app, document.getElementById("app"));
