import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/configureStore";

import "bootstrap/dist/css/bootstrap.css"; // Bootstrap styles
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import NavigationBar from "./components/navigation-bar/NavigationBar";
import "./styles/index.css";

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