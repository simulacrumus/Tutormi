import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css'; // Bootstrap styles
import {store, persistor} from './store/configureStore.js';
import ProfilePage from "./pages/ProfilePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TutorViewPage from "./pages/TutorViewPage.jsx";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

class Router extends Component {

  render() {
    return (
      <main>
        <Switch>
          <Route path='/' component={ProfilePage} exact />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/viewTutor" component={TutorViewPage} />
          <Route component={Error} /> {/* Need to make an error component later */}
        </Switch>
      </main>
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
serviceWorker.unregister();
