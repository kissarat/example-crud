import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { Provider } from "react-redux";
import reducer from "./reducers.jsx";
import App from "./containers/App.jsx";

const middleware = [];
if ("production" !== process.env.NODE_ENV) {
  middleware.push(createLogger());
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

const app = <Provider store={store}>
  <App />
</Provider>;

ReactDOM.render(app, document.getElementById("app"));
