import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/configureStore";

import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css"; // Bootstrap styles
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import NavigationBar from "./components/navigation-bar/NavigationBar";
import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
      <BrowserRouter>
        <NavigationBar />
        <Router />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
