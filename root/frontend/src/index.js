import React from "react";
import ReactDOM from "react-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import App from "./components/App";
import SearchMain from "./components/searchMain";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

//const persistor = persistStore(store);
ReactDOM.render(
  <Provider store={store}>
    <SearchMain />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
