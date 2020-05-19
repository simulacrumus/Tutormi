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
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import searchMain from "./components/searchMain";
import TutorDashboardPage from "./pages/TutorDashboardPage.jsx";
import { connect } from "react-redux";
import initialState from "./initialState.js";

class Router extends Component {

  render() {
    return (
      <main>
        <Switch>
          <Route path='/' component={ProfilePage} exact />
          <Route path="/dashboard" render={() => ( initialState.user.type === "tutee" ? <DashboardPage /> : <TutorDashboardPage />) }  />
          <Route path="/viewTutor" component={TutorViewPage} />
          <Route path="/search" component={searchMain}/>
          <Route path="*" render={() => (<h1>404 Page Not Found!</h1>)} /> {/* Need to make an error component later */}
        </Switch>
      </main>
    );
  }

}

// function mapStateToProps(state) {
//   return {
//       user: state.profileReducer.user,
//   };
// }

// connect(mapStateToProps)(DashboardPage);

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
