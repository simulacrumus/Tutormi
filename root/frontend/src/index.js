import React, {Component} from "react";
import ReactDOM from "react-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./store/configureStore";
import App from "./components/App";
import SearchMain from "./components/searchMain";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import 'bootstrap/dist/css/bootstrap.css'; // Bootstrap styles
import ProfilePage from "./pages/ProfilePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TutorViewPage from "./pages/TutorViewPage.jsx";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class Router extends Component {

  render() {
    return (
     // <main>
        <Switch>
          <Route path='/' component={ProfilePage} exact />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/viewTutor" component={TutorViewPage} />
          <Route path="/search" component={SearchMain} />
          <Route component={Error} /> {/* Need to make an error component later */}
        </Switch>
     // </main>
    );
  }

}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}> {/* add loading later*/}
        <Router />
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
